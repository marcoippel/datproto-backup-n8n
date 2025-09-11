#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class HealthChecker {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  async runHealthCheck() {
    console.log(chalk.blue('🏥 Running system health check...\n'));

    await this.checkDirectoryStructure();
    await this.checkWorkflowFiles();
    await this.checkConfiguration();
    await this.checkSecurity();
    await this.checkDocumentation();

    this.printSummary();
    return this.results.failed === 0;
  }

  async checkDirectoryStructure() {
    this.log('info', 'Checking directory structure...');

    const requiredDirs = [
      'workflows',
      'workflows/alerts',
      'workflows/analytics', 
      'workflows/automation',
      'workflows/backup',
      'config',
      'config/schema',
      'config/examples',
      'scripts',
      'docs',
      '.github',
      '.github/workflows'
    ];

    for (const dir of requiredDirs) {
      const exists = await fs.pathExists(path.join(__dirname, '..', dir));
      if (exists) {
        this.pass(`✓ Directory exists: ${dir}`);
      } else {
        this.fail(`✗ Missing directory: ${dir}`);
      }
    }
  }

  async checkWorkflowFiles() {
    this.log('info', 'Checking workflow files...');

    const workflowDirs = ['workflows/alerts', 'workflows/analytics', 'workflows/automation', 'workflows/backup'];
    let totalWorkflows = 0;

    for (const dir of workflowDirs) {
      const dirPath = path.join(__dirname, '..', dir);
      if (await fs.pathExists(dirPath)) {
        const files = await fs.readdir(dirPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        totalWorkflows += jsonFiles.length;
        
        if (jsonFiles.length > 0) {
          this.pass(`✓ ${dir}: ${jsonFiles.length} workflows`);
        } else {
          this.warn(`⚠ ${dir}: No workflows found`);
        }

        // Check for documentation
        for (const jsonFile of jsonFiles) {
          const docFile = jsonFile.replace('.json', '.md');
          const docExists = files.includes(docFile);
          if (!docExists) {
            this.warn(`⚠ Missing documentation: ${dir}/${docFile}`);
          }
        }
      }
    }

    if (totalWorkflows > 0) {
      this.pass(`✓ Total workflows found: ${totalWorkflows}`);
    } else {
      this.fail('✗ No workflows found in organized structure');
    }
  }

  async checkConfiguration() {
    this.log('info', 'Checking configuration files...');

    const requiredFiles = [
      'package.json',
      '.gitignore',
      'README.md',
      'CONTRIBUTING.md',
      'config/schema/workflow-schema.json',
      'config/examples/.env.example'
    ];

    for (const file of requiredFiles) {
      const exists = await fs.pathExists(path.join(__dirname, '..', file));
      if (exists) {
        this.pass(`✓ Configuration file exists: ${file}`);
      } else {
        this.fail(`✗ Missing configuration file: ${file}`);
      }
    }

    // Check package.json scripts
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const requiredScripts = ['validate', 'lint', 'format', 'categorize', 'health-check'];
      
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.pass(`✓ Script defined: ${script}`);
        } else {
          this.fail(`✗ Missing script: ${script}`);
        }
      }
    }
  }

  async checkSecurity() {
    this.log('info', 'Checking security configuration...');

    // Check for .env file (should not exist in repo)
    const envExists = await fs.pathExists(path.join(__dirname, '..', '.env'));
    if (envExists) {
      this.fail('✗ .env file found in repository (security risk)');
    } else {
      this.pass('✓ No .env file in repository');
    }

    // Check .gitignore
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      const securityPatterns = ['.env', 'credentials', 'secrets', '*.key'];
      
      for (const pattern of securityPatterns) {
        if (gitignoreContent.includes(pattern)) {
          this.pass(`✓ .gitignore includes: ${pattern}`);
        } else {
          this.warn(`⚠ .gitignore missing: ${pattern}`);
        }
      }
    }

    // Scan for potential hardcoded secrets
    const workflowFiles = await this.findWorkflowFiles();
    let secretsFound = 0;

    for (const file of workflowFiles) {
      const content = await fs.readFile(file, 'utf8');
      const suspiciousPatterns = [
        /[A-Za-z0-9]{32,}/g,  // Potential API keys
        /sk-[A-Za-z0-9]{32,}/g, // OpenAI keys
        /xoxb-[A-Za-z0-9-]+/g,  // Slack tokens
      ];

      for (const pattern of suspiciousPatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
          // Check if it's already a template variable
          const isTemplate = matches.every(match => 
            content.includes(`\${${match}}`) || content.includes(`"${match}"`) === false
          );
          
          if (!isTemplate) {
            secretsFound++;
            this.warn(`⚠ Potential hardcoded secret in: ${path.relative(process.cwd(), file)}`);
          }
        }
      }
    }

    if (secretsFound === 0) {
      this.pass('✓ No hardcoded secrets detected');
    }
  }

  async checkDocumentation() {
    this.log('info', 'Checking documentation...');

    const readmePath = path.join(__dirname, '..', 'README.md');
    if (await fs.pathExists(readmePath)) {
      const content = await fs.readFile(readmePath, 'utf8');
      const requiredSections = [
        'Architecture Overview',
        'Quick Start', 
        'Security',
        'Contributing'
      ];

      for (const section of requiredSections) {
        if (content.includes(section)) {
          this.pass(`✓ README includes: ${section}`);
        } else {
          this.warn(`⚠ README missing section: ${section}`);
        }
      }
    }
  }

  async findWorkflowFiles() {
    const glob = require('glob');
    return glob.sync(path.join(__dirname, '../workflows/**/*.json'));
  }

  pass(message) {
    this.results.passed++;
    this.results.details.push({ type: 'pass', message });
    console.log(chalk.green(message));
  }

  fail(message) {
    this.results.failed++;
    this.results.details.push({ type: 'fail', message });
    console.log(chalk.red(message));
  }

  warn(message) {
    this.results.warnings++;
    this.results.details.push({ type: 'warn', message });
    console.log(chalk.yellow(message));
  }

  log(level, message) {
    console.log(chalk.blue(message));
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log(chalk.bold('Health Check Summary'));
    console.log('='.repeat(50));
    
    console.log(chalk.green(`✓ Passed: ${this.results.passed}`));
    console.log(chalk.red(`✗ Failed: ${this.results.failed}`));
    console.log(chalk.yellow(`⚠ Warnings: ${this.results.warnings}`));

    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = ((this.results.passed / total) * 100).toFixed(1);
    
    console.log(chalk.blue(`📊 Success Rate: ${successRate}%`));

    if (this.results.failed === 0) {
      console.log(chalk.green.bold('\n🎉 System health check passed!'));
    } else {
      console.log(chalk.red.bold('\n❌ System health check failed.'));
      console.log(chalk.yellow('Please address the failed checks above.'));
    }
  }
}

async function main() {
  const checker = new HealthChecker();
  const healthy = await checker.runHealthCheck();
  process.exit(healthy ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Health check failed:'), error);
    process.exit(1);
  });
}

module.exports = HealthChecker;