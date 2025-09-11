# Execute Workflow Trigger

## Overview
Category: **backup**  
Nodes: **31**  
Triggers: **0**

## Description
Backup and recovery workflows

## Nodes
- **On clicking 'execute'** (n8n-nodes-base.manualTrigger)
- **Sticky Note** (n8n-nodes-base.stickyNote)
- **Execute Workflow Trigger** (n8n-nodes-base.executeWorkflowTrigger)
- **n8n** (n8n-nodes-base.n8n)
- **Return** (n8n-nodes-base.set)
- **If file too large** (n8n-nodes-base.if)
- **Merge Items** (n8n-nodes-base.merge)
- **Same file - Do nothing** (n8n-nodes-base.noOp)
- **File is different** (n8n-nodes-base.noOp)
- **File is new** (n8n-nodes-base.noOp)
- **Create new file** (n8n-nodes-base.github)
- **Edit existing file** (n8n-nodes-base.github)
- **Loop Over Items** (n8n-nodes-base.splitInBatches)
- **Schedule Trigger** (n8n-nodes-base.scheduleTrigger)
- **Create sub path** (n8n-nodes-base.set)
- **Sticky Note2** (n8n-nodes-base.stickyNote)
- **Config** (n8n-nodes-base.set)
- **Get file data** (n8n-nodes-base.github)
- **Execute Workflow** (n8n-nodes-base.executeWorkflow)
- **Wait** (n8n-nodes-base.wait)
- **Get file** (n8n-nodes-base.github)
- **Wait1** (n8n-nodes-base.wait)
- **verifyTheDifference** (n8n-nodes-base.code)
- **Switch** (n8n-nodes-base.switch)
- **Wait2** (n8n-nodes-base.wait)
- **Sticky Note1** (n8n-nodes-base.stickyNote)
- **Sticky Note3** (n8n-nodes-base.stickyNote)
- **Send a text message** (n8n-nodes-base.telegram)
- **Send a text message1** (n8n-nodes-base.telegram)
- **Inform Success Flows1** (n8n-nodes-base.telegram)
- **Inform Failed Flows1** (n8n-nodes-base.telegram)

## Triggers
No triggers found

## Configuration
This workflow requires the following environment variables:
- Check the main workflow file for `${VARIABLE_NAME}` placeholders
- Configure these variables in your `.env` file

## Usage
1. Import this workflow into your N8N instance
2. Configure the required credentials and environment variables
3. Activate the workflow

## Notes
- Original workflow ID: `execute-workflow-trigger`
- Migrated from legacy backup structure
- All sensitive credentials have been replaced with environment variables

---
*Generated automatically during workflow categorization*
