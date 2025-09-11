#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const Ajv = require('ajv');
const glob = require('glob');
const chalk = require('chalk');

class WorkflowValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.schema = null;
    this.errors = [];
    this.warnings = [];
  }

  async loadSchema() {
    try {
      const schemaPath = path.join(__dirname, '../config/schema/workflow-schema.json');
      this.schema = await fs.readJson(schemaPath);
      this.validate = this.ajv.compile(this.schema);
      console.log(chalk.green('✓ Schema loaded successfully'));
    } catch (error) {
      console.error(chalk.red('✗ Failed to load schema:'), error.message);
      process.exit(1);
    }
  }

  async validateWorkflows() {
    const workflowPattern = path.join(__dirname, '../workflows/**/*.json');
    const legacyPattern = path.join(__dirname, '../2025/**/*.json');
    
    const workflowFiles = [
      ...glob.sync(workflowPattern),
      ...glob.sync(legacyPattern)
    ];

    if (workflowFiles.length === 0) {
      console.log(chalk.yellow('⚠ No workflow files found'));
      return true;
    }

    console.log(chalk.blue(`\n🔍 Validating ${workflowFiles.length} workflow files...\n`));

    let validCount = 0;
    let invalidCount = 0;

    for (const filePath of workflowFiles) {
      const isValid = await this.validateFile(filePath);
      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
    }

    this.printSummary(validCount, invalidCount);
    return invalidCount === 0;
  }

  async validateFile(filePath) {
    try {
      const content = await fs.readJson(filePath);
      const isValid = this.validate(content);
      
      if (isValid) {
        console.log(chalk.green('✓'), path.relative(process.cwd(), filePath));
        this.checkWorkflowQuality(content, filePath);
      } else {
        console.log(chalk.red('✗'), path.relative(process.cwd(), filePath));
        this.printValidationErrors(this.validate.errors);
        this.errors.push({
          file: filePath,
          errors: [...this.validate.errors]
        });
      }

      return isValid;
    } catch (error) {
      console.log(chalk.red('✗'), path.relative(process.cwd(), filePath), chalk.red(`(${error.message})`));
      this.errors.push({
        file: filePath,
        errors: [{ message: error.message }]
      });
      return false;
    }
  }

  checkWorkflowQuality(workflow, filePath) {
    const warnings = [];

    // Check for hardcoded credentials
    const workflowStr = JSON.stringify(workflow);
    const suspiciousPatterns = [
      /[A-Za-z0-9]{32,}/g, // Potential API keys
      /@[\w.-]+\.[A-Za-z]{2,}/g, // Email addresses
      /password["\s]*:["\s]*[^"]+/gi, // Passwords
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(workflowStr)) {
        warnings.push('Potential hardcoded credentials detected');
      }
    });

    // Check for missing error handling
    const hasErrorHandling = workflow.nodes.some(node => 
      node.continueOnFail || node.onError
    );

    if (!hasErrorHandling) {
      warnings.push('No error handling configured');
    }

    // Check for missing documentation
    if (!workflow.nodes.some(node => node.type === 'n8n-nodes-base.stickyNote')) {
      warnings.push('No documentation nodes found');
    }

    if (warnings.length > 0) {
      console.log(chalk.yellow('  ⚠ Warnings:'));
      warnings.forEach(warning => {
        console.log(chalk.yellow(`    - ${warning}`));
      });
      this.warnings.push({
        file: filePath,
        warnings
      });
    }
  }

  printValidationErrors(errors) {
    errors.forEach(error => {
      console.log(chalk.red(`    - ${error.instancePath}: ${error.message}`));
    });
  }

  printSummary(validCount, invalidCount) {
    console.log('\n' + '='.repeat(50));
    console.log(chalk.bold('Validation Summary'));
    console.log('='.repeat(50));
    
    if (validCount > 0) {
      console.log(chalk.green(`✓ Valid workflows: ${validCount}`));
    }
    
    if (invalidCount > 0) {
      console.log(chalk.red(`✗ Invalid workflows: ${invalidCount}`));
    }

    if (this.warnings.length > 0) {
      console.log(chalk.yellow(`⚠ Workflows with warnings: ${this.warnings.length}`));
    }

    console.log('\n');

    if (invalidCount === 0) {
      console.log(chalk.green.bold('🎉 All workflows are valid!'));
    } else {
      console.log(chalk.red.bold('❌ Some workflows have validation errors.'));
      console.log(chalk.yellow('Please fix the errors above and run validation again.'));
    }
  }
}

async function main() {
  const validator = new WorkflowValidator();
  await validator.loadSchema();
  const isValid = await validator.validateWorkflows();
  
  process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Validation failed:'), error);
    process.exit(1);
  });
}

module.exports = WorkflowValidator;