# datproto-backup-n8n

[![CI/CD](https://github.com/marcoippel/datproto-backup-n8n/actions/workflows/ci.yml/badge.svg)](https://github.com/marcoippel/datproto-backup-n8n/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Enterprise-grade N8N workflow backup and management system for automated workflow versioning, validation, and deployment.

## 🏗️ Architecture Overview

This repository manages N8N workflows across multiple categories:

- **🔔 Alerts & Notifications**: Real-time monitoring and alerting systems
- **📊 Analytics & Reporting**: Data analysis and business intelligence workflows  
- **🔄 Automation & Integration**: System integrations and automated processes
- **💾 Backup & Recovery**: Data backup and disaster recovery workflows

## 📁 Repository Structure

```
├── workflows/
│   ├── alerts/          # Alert and notification workflows
│   ├── analytics/       # Data analysis and reporting
│   ├── automation/      # System automation workflows
│   └── backup/          # Backup and recovery workflows
├── config/
│   ├── schema/          # JSON schemas for workflow validation
│   ├── templates/       # Workflow templates
│   └── examples/        # Configuration examples
├── scripts/
│   ├── backup-workflows.js    # Automated backup operations
│   ├── validate-workflows.js  # Workflow validation
│   └── health-check.js       # System health monitoring
├── docs/                # Documentation
├── tests/               # Test suites
└── .github/             # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- N8N instance access (optional for validation)

### Installation

```bash
# Clone the repository
git clone https://github.com/marcoippel/datproto-backup-n8n.git
cd datproto-backup-n8n

# Install dependencies
npm install

# Run setup script
npm run setup

# Validate all workflows
npm run validate
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp config/examples/.env.example .env
   ```

2. Update the configuration with your credentials:
   ```bash
   # Edit .env with your settings
   N8N_API_URL=https://your-n8n-instance.com
   GITHUB_TOKEN=your_github_token
   # ... other configuration
   ```

## 📋 Available Commands

### Development
```bash
npm run dev          # Start development mode with file watching
npm run validate     # Validate all workflow files
npm run lint         # Run ESLint on all files
npm run format       # Format code with Prettier
npm test             # Run test suite
```

### Operations
```bash
npm run backup       # Create backup of all workflows
npm run restore      # Restore workflows from backup
npm run health-check # Check system health
npm run clean        # Remove duplicate workflow files
npm run categorize   # Organize workflows by category
```

## 🔧 Workflow Management

### Adding New Workflows

1. **Export from N8N**: Export your workflow as JSON
2. **Validate**: Run `npm run validate` to check the workflow
3. **Categorize**: Place in appropriate category folder
4. **Document**: Add workflow documentation

### Workflow Categories

- **`workflows/alerts/`**: Monitoring, notifications, and alerting
- **`workflows/analytics/`**: Data processing and analysis
- **`workflows/automation/`**: System integrations and automation
- **`workflows/backup/`**: Backup operations and data recovery

### Naming Convention

```
{category}/{workflow-name}-{version}.json
```

Example: `alerts/crypto-price-monitor-v1.2.json`

## 🔒 Security

### Credentials Management

**⚠️ NEVER commit credentials to version control!**

- Use environment variables for all sensitive data
- Store credentials in secure secret management systems
- Reference credentials by ID in workflows, not by value
- Use the provided configuration templates

### Best Practices

1. **Environment Separation**: Use different credentials for dev/staging/prod
2. **Least Privilege**: Grant minimal required permissions
3. **Regular Rotation**: Rotate API keys and tokens regularly
4. **Monitoring**: Enable audit logging for credential access

## 📊 Monitoring & Health Checks

### Automated Monitoring

The system includes built-in health checks:

```bash
# Run comprehensive health check
npm run health-check

# Check specific workflow category
npm run health-check -- --category alerts
```

### Metrics Tracked

- Workflow validation status
- File integrity checks
- Backup completeness
- Configuration drift detection

## 🔄 CI/CD Pipeline

### Automated Workflows

- **Validation**: All workflows validated on push
- **Testing**: Comprehensive test suite execution
- **Security Scanning**: Credential and vulnerability scanning
- **Deployment**: Automated deployment to staging/production

### Quality Gates

- JSON schema validation
- Credential scanning
- Duplicate detection
- Documentation completeness

## 📚 Documentation

- [Workflow Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [Security Best Practices](docs/security.md)
- [API Documentation](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Development workflow
- Code standards
- Pull request process
- Security guidelines

## 📈 Workflow Statistics

| Category | Workflows | Last Updated |
|----------|-----------|--------------|
| Alerts | 5 | 2025-09-10 |
| Analytics | 3 | 2025-09-10 |
| Automation | 7 | 2025-09-10 |
| Backup | 2 | 2025-09-10 |

## 🐛 Troubleshooting

### Common Issues

1. **Validation Errors**: Check JSON syntax and schema compliance
2. **Missing Credentials**: Verify environment configuration
3. **Deployment Failures**: Check CI/CD logs and permissions

### Getting Help

- Check the [troubleshooting guide](docs/troubleshooting.md)
- Search existing [issues](https://github.com/marcoippel/datproto-backup-n8n/issues)
- Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [N8N](https://n8n.io/) - Workflow automation platform
- [N8N Community Nodes](https://community.n8n.io/) - Community-driven nodes

---

**Made with ❤️ for enterprise workflow automation**