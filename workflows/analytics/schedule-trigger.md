# Schedule Trigger

## Overview
Category: **analytics**  
Nodes: **19**  
Triggers: **0**

## Description
Data analysis and reporting workflows

## Nodes
- **Nieuws ophalen** (n8n-nodes-base.httpRequest)
- **Schedule Trigger** (n8n-nodes-base.scheduleTrigger)
- **Extract Artikelen** (n8n-nodes-base.code)
- **OpenAI Analyse** (@n8n/n8n-nodes-langchain.openAi)
- **Send a text message** (n8n-nodes-base.telegram)
- **Telegram Trigger** (n8n-nodes-base.telegramTrigger)
- **Loop Over Items1** (n8n-nodes-base.splitInBatches)
- **AI Agent** (@n8n/n8n-nodes-langchain.agent)
- **OpenAI Chat Model** (@n8n/n8n-nodes-langchain.lmChatOpenAi)
- **Nieuws ophalen1** (n8n-nodes-base.httpRequest)
- **Code** (n8n-nodes-base.code)
- **Code1** (n8n-nodes-base.code)
- **Get row(s) in sheet** (n8n-nodes-base.googleSheets)
- **Send a text message1** (n8n-nodes-base.telegram)
- **Append or update row in sheet** (n8n-nodes-base.googleSheets)
- **If2** (n8n-nodes-base.if)
- **Check if a company is found** (n8n-nodes-base.if)
- **Is the company is checked last week** (n8n-nodes-base.code)
- **Is it checked last week** (n8n-nodes-base.if)

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
- Original workflow ID: `schedule-trigger`
- Migrated from legacy backup structure
- All sensitive credentials have been replaced with environment variables

---
*Generated automatically during workflow categorization*
