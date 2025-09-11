# Telegram Trigger

## Overview
Category: **analytics**  
Nodes: **14**  
Triggers: **0**

## Description
Data analysis and reporting workflows

## Nodes
- **HTTP 1M** (n8n-nodes-base.httpRequest)
- **HTTP 15M** (n8n-nodes-base.httpRequest)
- **HTTP 1H** (n8n-nodes-base.httpRequest)
- **Merge** (n8n-nodes-base.merge)
- **Aggregate** (n8n-nodes-base.aggregate)
- **Code** (n8n-nodes-base.code)
- **HTTP Request** (n8n-nodes-base.httpRequest)
- **Telegram Trigger** (n8n-nodes-base.telegramTrigger)
- **Message a model** (@n8n/n8n-nodes-langchain.openAi)
- **Merge1** (n8n-nodes-base.merge)
- **Aggregate1** (n8n-nodes-base.aggregate)
- **AI Agent** (@n8n/n8n-nodes-langchain.agent)
- **OpenAI Chat Model** (@n8n/n8n-nodes-langchain.lmChatOpenAi)
- **Send a text message** (n8n-nodes-base.telegram)

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
- Original workflow ID: `telegram-trigger`
- Migrated from legacy backup structure
- All sensitive credentials have been replaced with environment variables

---
*Generated automatically during workflow categorization*
