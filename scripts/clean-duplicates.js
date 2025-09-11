#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class WorkflowCleanup {
  constructor() {
    this.duplicatesFound = 0;
    this.filesRemoved = 0;
  }

  async cleanDuplicates() {
    console.log(chalk.blue('🧹 Cleaning duplicate workflow files...\n'));

    // Find all files in legacy structure
    const legacyDir = path.join(__dirname, '../2025');
    
    if (!(await fs.pathExists(legacyDir))) {
      console.log(chalk.yellow('⚠ No legacy directory found'));
      return;
    }

    const workflowMap = new Map();
    await this.scanForDuplicates(legacyDir, workflowMap);

    if (this.duplicatesFound === 0) {
      console.log(chalk.green('✅ No duplicate files found'));
      return;
    }

    console.log(chalk.yellow(`\n📋 Found ${this.duplicatesFound} duplicate workflow files`));
    console.log(chalk.blue('Keeping the latest version of each workflow...\n'));

    // Remove duplicates (keep the latest)
    for (const [workflowId, versions] of workflowMap) {
      if (versions.length > 1) {
        // Sort by modification time, keep the latest
        versions.sort((a, b) => b.mtime - a.mtime);
        const keepFile = versions[0];
        const removeFiles = versions.slice(1);

        console.log(chalk.green(`✓ Keeping: ${path.relative(process.cwd(), keepFile.path)}`));
        
        for (const file of removeFiles) {
          await fs.remove(file.path);
          this.filesRemoved++;
          console.log(chalk.red(`  ✗ Removed: ${path.relative(process.cwd(), file.path)}`));
        }
      }
    }

    // Remove empty directories
    await this.removeEmptyDirectories(legacyDir);

    console.log(chalk.green(`\n✅ Cleanup completed! Removed ${this.filesRemoved} duplicate files.`));
  }

  async scanForDuplicates(dir, workflowMap) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await this.scanForDuplicates(fullPath, workflowMap);
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        const workflowId = path.basename(entry.name, '.json');
        const stats = await fs.stat(fullPath);

        if (!workflowMap.has(workflowId)) {
          workflowMap.set(workflowId, []);
        }

        workflowMap.get(workflowId).push({
          path: fullPath,
          mtime: stats.mtime
        });

        if (workflowMap.get(workflowId).length > 1) {
          this.duplicatesFound++;
        }
      }
    }
  }

  async removeEmptyDirectories(dir) {
    const entries = await fs.readdir(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        await this.removeEmptyDirectories(fullPath);
        
        // Check if directory is empty after recursive cleanup
        const remaining = await fs.readdir(fullPath);
        if (remaining.length === 0) {
          await fs.remove(fullPath);
          console.log(chalk.yellow(`  🗑️ Removed empty directory: ${path.relative(process.cwd(), fullPath)}`));
        }
      }
    }
  }
}

async function main() {
  const cleanup = new WorkflowCleanup();
  await cleanup.cleanDuplicates();
}

if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('Cleanup failed:'), error);
    process.exit(1);
  });
}

module.exports = WorkflowCleanup;