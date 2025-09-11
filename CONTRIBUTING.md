# Contributing to datproto-backup-n8n

Thank you for your interest in contributing to our enterprise N8N workflow backup system! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- Basic understanding of N8N workflows

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/datproto-backup-n8n.git
   cd datproto-backup-n8n
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp config/examples/.env.example .env
   # Edit .env with your configuration
   ```

4. **Validate Setup**
   ```bash
   npm run validate
   npm run lint
   npm test
   ```

## 📝 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - Feature development
- `hotfix/issue-description` - Critical fixes

### Workflow Categories

When adding new workflows, categorize them appropriately:

- **`workflows/alerts/`** - Monitoring, notifications, alerting
- **`workflows/analytics/`** - Data processing, analysis, reporting
- **`workflows/automation/`** - System integrations, automation
- **`workflows/backup/`** - Backup operations, data recovery

## 🔒 Security Guidelines

### Credential Management

**⚠️ NEVER commit credentials or API keys!**

- Use environment variables for all sensitive data
- Reference credentials by placeholder: `${VARIABLE_NAME}`
- Test with `npm run security-scan` before committing

### Credential Replacement

When adding workflows:

1. Replace hardcoded values with environment variables
2. Update `.env.example` with new variables
3. Document required credentials in workflow documentation

Example:
```javascript
// ❌ Bad
"apiKey": "sk-1234567890abcdef"

// ✅ Good  
"apiKey": "${OPENAI_API_KEY}"
```

## 📊 Code Standards

### File Naming

- Workflows: `category/descriptive-name-v1.0.json`
- Scripts: `kebab-case.js`
- Documentation: `workflow-name.md`

### JSON Formatting

- Use 2-space indentation
- Run `npm run format` before committing
- Validate with `npm run validate`

### Documentation Requirements

Every workflow must include:

1. **JSON workflow file** in appropriate category
2. **Markdown documentation** with same name
3. **Environment variables** documented
4. **Usage instructions**

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Validation only
npm run validate

# Linting
npm run lint
```

### Adding Tests

- Add tests for new scripts in `tests/`
- Test workflow validation
- Test security scanning
- Mock external API calls

## 📋 Pull Request Process

### Before Submitting

1. **Validate Workflows**
   ```bash
   npm run validate
   ```

2. **Run Security Scan**
   ```bash
   npm run security-scan
   ```

3. **Format Code**
   ```bash
   npm run format
   ```

4. **Update Documentation**
   - Update README if needed
   - Add/update workflow documentation
   - Update CHANGELOG.md

### PR Template

Use this template for pull requests:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New workflow
- [ ] Script improvement
- [ ] Documentation update
- [ ] Security enhancement

## Workflow Category
- [ ] Alerts
- [ ] Analytics  
- [ ] Automation
- [ ] Backup

## Testing
- [ ] Workflow validation passes
- [ ] Security scan clean
- [ ] Tests added/updated
- [ ] Documentation updated

## Security Checklist
- [ ] No hardcoded credentials
- [ ] Environment variables documented
- [ ] Security scan passed
```

### Review Process

1. Automated checks must pass
2. Security review for credential handling
3. Code review by maintainer
4. Documentation completeness check
5. Manual testing if needed

## 🐛 Bug Reports

### Reporting Issues

Use the issue template and include:

- **Environment**: N8N version, Node.js version
- **Workflow**: Affected workflow category/name
- **Steps to Reproduce**: Detailed steps
- **Expected vs Actual**: Clear description
- **Logs**: Relevant error messages

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `security` - Security-related issue
- `documentation` - Documentation improvement
- `workflow` - Workflow-specific issue

## 📚 Development Resources

### Useful Commands

```bash
# Development
npm run dev              # Start development mode
npm run categorize       # Organize workflows
npm run clean           # Remove duplicates

# Quality
npm run validate        # Validate all workflows
npm run lint           # Lint code
npm run format         # Format code
npm run security-scan  # Scan for secrets

# Operations
npm run backup         # Backup workflows
npm run health-check   # System health
```

### Project Structure

```
├── workflows/         # Categorized workflow files
├── config/           # Configuration and schemas
├── scripts/          # Automation scripts
├── docs/            # Documentation
├── tests/           # Test suites
└── .github/         # CI/CD workflows
```

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- CHANGELOG.md release notes
- GitHub repository insights

## 📞 Getting Help

- **Questions**: Open a GitHub discussion
- **Issues**: Create a GitHub issue
- **Security**: Email security@example.com
- **Chat**: Join our community Discord

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to enterprise workflow automation! 🚀**