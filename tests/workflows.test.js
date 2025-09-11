const path = require('path');
const fs = require('fs-extra');
const WorkflowValidator = require('../scripts/validate-workflows');

describe('Workflow Validation', () => {
  let validator;

  beforeEach(() => {
    validator = new WorkflowValidator();
  });

  test('should load schema successfully', async () => {
    await expect(validator.loadSchema()).resolves.not.toThrow();
    expect(validator.schema).toBeDefined();
  });

  test('should validate a valid workflow', async () => {
    const validWorkflow = {
      nodes: [
        {
          id: '12345678-1234-1234-1234-123456789012',
          name: 'Test Node',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 1,
          position: [100, 200],
          parameters: {}
        }
      ],
      connections: {}
    };

    await validator.loadSchema();
    const isValid = validator.validate(validWorkflow);
    expect(isValid).toBe(true);
  });

  test('should reject invalid workflow', async () => {
    const invalidWorkflow = {
      // Missing required 'nodes' field
      connections: {}
    };

    await validator.loadSchema();
    const isValid = validator.validate(invalidWorkflow);
    expect(isValid).toBe(false);
    expect(validator.validate.errors).toBeDefined();
  });

  test('should validate node types with @ symbol', async () => {
    const workflowWithCommunityNode = {
      nodes: [
        {
          id: '12345678-1234-1234-1234-123456789012',
          name: 'Community Node',
          type: '@n8n/n8n-nodes-langchain.openAi',
          typeVersion: 1,
          position: [100, 200],
          parameters: {}
        }
      ],
      connections: {}
    };

    await validator.loadSchema();
    const isValid = validator.validate(workflowWithCommunityNode);
    expect(isValid).toBe(true);
  });
});

describe('Workflow Organization', () => {
  test('should categorize workflows correctly', () => {
    const WorkflowCategorizer = require('../scripts/categorize-workflows');
    const categorizer = new WorkflowCategorizer();

    // Test alert workflow detection
    const alertWorkflow = {
      nodes: [
        { name: 'Telegram Alert', type: 'n8n-nodes-base.telegram' },
        { name: 'Monitor Price', type: 'n8n-nodes-base.cron' }
      ]
    };

    const category = categorizer.determineCategory(alertWorkflow);
    expect(category).toBe('alerts');
  });

  test('should sanitize workflow names', () => {
    const WorkflowCategorizer = require('../scripts/categorize-workflows');
    const categorizer = new WorkflowCategorizer();

    const sanitized = categorizer.sanitizeName('My Workflow Name! @#$');
    expect(sanitized).toBe('my-workflow-name');
  });
});