# Dkpanays8dnrlnkc

## Overview
Category: **analytics**  
Nodes: **11**  
Triggers: **0**

## Description
Data analysis and reporting workflows

## Nodes
- **Cron (every 1 min)** (n8n-nodes-base.cron)
- **Telegram → Send Message** (n8n-nodes-base.telegram)
- **HTTP Request** (n8n-nodes-base.httpRequest)
- **Code** (n8n-nodes-base.code)
- **Postgres → Load Watchlist1** (n8n-nodes-base.postgres)
- **Edit Fields** (n8n-nodes-base.set)
- **Postgres → Set last_notified_at1** (n8n-nodes-base.postgres)
- **Loop Over Items** (n8n-nodes-base.splitInBatches)
- **Alpaca → Latest 1m Bar1** (n8n-nodes-base.httpRequest)
- **Check vs Target + Debounce** (n8n-nodes-base.code)
- **Merge** (n8n-nodes-base.merge)

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
- Original workflow ID: `dkpanays8dnrlnkc`
- Migrated from legacy backup structure
- All sensitive credentials have been replaced with environment variables

---
*Generated automatically during workflow categorization*
