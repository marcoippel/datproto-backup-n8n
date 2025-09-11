#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

class WorkflowCategorizer {
  constructor() {
    this.categories = {
      alerts: {
        keywords: ['telegram', 'notification', 'alert', 'monitor', 'cron', 'price', 'threshold'],
        description: 'Alert and notification workflows'
      },
      analytics: {
        keywords: ['openai', 'analysis', 'ai', 'news', 'data', 'growth', 'report'],
        description: 'Data analysis and reporting workflows'
      },
      automation: {
        keywords: ['http', 'api', 'schedule', 'trigger', 'webhook', 'integration'],
        description: 'System automation and integration workflows'
      },
      backup: {
        keywords: ['backup', 'github', 'n8n', 'workflow', 'export', 'sync'],
        description: 'Backup and recovery workflows'
      }
    };

    this.credentialMappings = new Map([
      ['PKU0NRQDJV8J14GKYDGO', '${ALPACA_API_KEY_ID}'],
      ['38LahGNwNJa0yq6RFy8OxXv3VgS1gYGzxR3gYCiv', '${ALPACA_API_SECRET_KEY}'],
      ['8400587790', '${TELEGRAM_CHAT_ID}'],
      ['marcoippel', '${GITHUB_REPO_OWNER}'],
      ['datproto-backup-n8n', '${GITHUB_REPO_NAME}']
    ]);
  }

  async categorizeWorkflows() {
    console.log(chalk.blue('🗂️ Categorizing workflows...\n'));

    // Find all workflow files in the legacy structure
    const legacyPattern = path.join(__dirname, '../2025/**/*.json');
    const workflowFiles = glob.sync(legacyPattern);

    if (workflowFiles.length === 0) {
      console.log(chalk.yellow('⚠ No legacy workflow files found'));
      return;
    }

    // Get unique workflows (remove duplicates)
    const uniqueWorkflows = await this.getUniqueWorkflows(workflowFiles);
    
    console.log(chalk.green(`📊 Found ${uniqueWorkflows.size} unique workflows\n`));

    // Process each unique workflow
    for (const [workflowId, workflowData] of uniqueWorkflows) {
      await this.processWorkflow(workflowId, workflowData);
    }

    console.log(chalk.green('\n✅ Workflow categorization completed!'));
  }

  async getUniqueWorkflows(workflowFiles) {
    const uniqueWorkflows = new Map();

    for (const filePath of workflowFiles) {
      try {
        const content = await fs.readJson(filePath);
        const workflowId = path.basename(filePath, '.json');
        
        if (!uniqueWorkflows.has(workflowId)) {
          uniqueWorkflows.set(workflowId, {
            content,
            originalPath: filePath,
            lastModified: (await fs.stat(filePath)).mtime
          });
        } else {
          // Keep the most recently modified version
          const existing = uniqueWorkflows.get(workflowId);
          const currentModified = (await fs.stat(filePath)).mtime;
          
          if (currentModified > existing.lastModified) {
            existing.content = content;
            existing.originalPath = filePath;
            existing.lastModified = currentModified;
          }
        }
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Skipping invalid file: ${filePath} - ${error.message}`));
      }
    }

    return uniqueWorkflows;
  }

  async processWorkflow(workflowId, workflowData) {
    const { content, originalPath } = workflowData;
    
    // Determine category
    const category = this.determineCategory(content);
    
    // Clean workflow (remove credentials)
    const cleanedWorkflow = this.cleanWorkflow(content);
    
    // Generate workflow name
    const workflowName = this.generateWorkflowName(content, workflowId);
    
    // Create target directory
    const targetDir = path.join(__dirname, `../workflows/${category}`);
    await fs.ensureDir(targetDir);
    
    // Save cleaned workflow
    const targetPath = path.join(targetDir, `${workflowName}.json`);
    await fs.writeJson(targetPath, cleanedWorkflow, { spaces: 2 });
    
    console.log(chalk.green('✓'), `${chalk.cyan(category)}/${workflowName}.json`);
    
    // Create documentation file
    await this.createDocumentation(targetDir, workflowName, content, category);
  }

  determineCategory(workflow) {
    const workflowText = JSON.stringify(workflow).toLowerCase();
    
    let bestMatch = 'automation'; // default category
    let maxScore = 0;

    for (const [category, config] of Object.entries(this.categories)) {
      const score = config.keywords.reduce((acc, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        const matches = workflowText.match(regex);
        return acc + (matches ? matches.length : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = category;
      }
    }

    return bestMatch;
  }

  cleanWorkflow(workflow) {
    // Deep clone the workflow
    const cleaned = JSON.parse(JSON.stringify(workflow));
    
    // Remove sensitive data and replace with environment variables
    this.recursiveClean(cleaned);
    
    return cleaned;
  }

  recursiveClean(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => this.recursiveClean(item));
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Replace known sensitive values
        for (const [sensitiveValue, replacement] of this.credentialMappings) {
          if (value.includes(sensitiveValue)) {
            obj[key] = value.replace(sensitiveValue, replacement);
          }
        }

        // Replace potential API keys (32+ character alphanumeric strings)
        if (key.toLowerCase().includes('key') || key.toLowerCase().includes('token')) {
          if (/^[A-Za-z0-9]{32,}$/.test(value)) {
            obj[key] = `\${${key.toUpperCase()}}`;
          }
        }
      } else if (typeof value === 'object') {
        this.recursiveClean(value);
      }
    }
  }

  generateWorkflowName(workflow, fallbackId) {
    // Try to extract a meaningful name from the workflow
    const triggerNodes = workflow.nodes?.filter(node => 
      node.type?.includes('trigger') || node.name?.toLowerCase().includes('trigger')
    );

    if (triggerNodes?.length > 0) {
      const triggerName = triggerNodes[0].name || triggerNodes[0].type;
      return this.sanitizeName(triggerName);
    }

    // Look for descriptive sticky notes
    const stickyNotes = workflow.nodes?.filter(node => 
      node.type === 'n8n-nodes-base.stickyNote'
    );

    if (stickyNotes?.length > 0) {
      const content = stickyNotes[0].parameters?.content || '';
      const title = content.split('\n')[0].replace(/[#\s]/g, '');
      if (title) {
        return this.sanitizeName(title);
      }
    }

    // Fallback to workflow ID
    return this.sanitizeName(fallbackId || 'unnamed-workflow');
  }

  sanitizeName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
      .replace(/^-|-$/g, '');
  }

  async createDocumentation(targetDir, workflowName, workflow, category) {
    const docPath = path.join(targetDir, `${workflowName}.md`);
    
    // Extract workflow information
    const nodeCount = workflow.nodes?.length || 0;
    const triggerNodes = workflow.nodes?.filter(node => 
      node.type?.includes('trigger')
    ) || [];
    
    const documentation = `# ${workflowName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

## Overview
Category: **${category}**  
Nodes: **${nodeCount}**  
Triggers: **${triggerNodes.length}**

## Description
${this.categories[category].description}

## Nodes
${workflow.nodes?.map(node => `- **${node.name}** (${node.type})`).join('\n') || 'No nodes found'}

## Triggers
${triggerNodes.map(node => `- **${node.name}** (${node.type})`).join('\n') || 'No triggers found'}

## Configuration
This workflow requires the following environment variables:
- Check the main workflow file for \`\${VARIABLE_NAME}\` placeholders
- Configure these variables in your \`.env\` file

## Usage
1. Import this workflow into your N8N instance
2. Configure the required credentials and environment variables
3. Activate the workflow

## Notes
- Original workflow ID: \`${workflowName}\`
- Migrated from legacy backup structure
- All sensitive credentials have been replaced with environment variables

---
*Generated automatically during workflow categorization*
`;

    await fs.writeFile(docPath, documentation);
  }
}

async function main() {
  const categorizer = new WorkflowCategorizer();
  await categorizer.categorizeWorkflows();
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Categorization failed:'), error);
    process.exit(1);
  });
}

module.exports = WorkflowCategorizer;