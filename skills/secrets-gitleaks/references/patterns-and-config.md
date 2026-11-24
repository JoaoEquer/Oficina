# Gitleaks: patterns, integrations, compliance and advanced config

## Contents

- Security Considerations
- Common Patterns
- Integration Points
- Advanced Configuration

## Security Considerations

### Sensitive Data Handling

- **Secret Redaction**: Always use `--redact` flag in logs and reports to prevent accidental secret exposure
- **Report Security**: Gitleaks reports contain detected secrets - treat as confidential, encrypt at rest
- **Git History**: Detected secrets in git history require complete removal using tools like `git filter-repo` or `BFG Repo-Cleaner`
- **Credential Rotation**: All exposed secrets must be rotated immediately, even if removed from code

### Access Control

- **CI/CD Permissions**: Gitleaks scans require read access to repository content and git history
- **Report Access**: Restrict access to scan reports containing sensitive findings
- **Baseline Files**: Baseline JSON files contain secret metadata - protect with same controls as findings

### Audit Logging

Log the following for compliance and incident response:
- Scan execution timestamps and scope (repository, branch, commit range)
- Number and types of secrets detected
- Remediation actions taken (credential rotation, commit history cleanup)
- False positive classifications and allowlist updates

### Compliance Requirements

- **PCI-DSS 3.2.1**: Requirement 6.5.3 - Prevent hardcoded credentials in payment applications
- **SOC2**: CC6.1 - Logical access controls prevent unauthorized credential exposure
- **GDPR**: Article 32 - Appropriate security measures for processing personal data credentials
- **CWE-798**: Use of Hard-coded Credentials
- **CWE-259**: Use of Hard-coded Password
- **OWASP A07:2021**: Identification and Authentication Failures

## Common Patterns

### Pattern 1: Initial Repository Audit

First-time secret scanning for security assessment:

```bash
# 1. Clone repository with full history
git clone --mirror https://github.com/org/repo.git audit-repo
cd audit-repo

# 2. Run comprehensive scan
gitleaks detect --report-path audit-report.json --report-format json -v

# 3. Review findings and classify false positives
# Edit .gitleaks.toml to add allowlist entries

# 4. Create baseline for future scans
cp audit-report.json baseline.json
```

### Pattern 2: Developer Workstation Setup

Protect developers from accidental secret commits:

```bash
# 1. Install gitleaks locally
brew install gitleaks  # macOS
# or use package manager for your OS

# 2. Install pre-commit hook (see "Pre-Commit Hook Protection" in SKILL.md)

# 3. Test hook with a throwaway GitHub-token-shaped value, generated so no secret lives in the repo
echo "token = ghp_$(head -c 18 /dev/urandom | xxd -p)" > test.txt
git add test.txt
git commit -m "test"  # Should be blocked by gitleaks

# 4. Clean up test (the commit was blocked, so there is nothing to reset;
#    never `git reset HEAD~1` here, it would undo your previous commit)
git restore --staged test.txt
rm test.txt
```

### Pattern 3: CI/CD Pipeline with Baseline

Progressive secret detection in continuous integration:

```bash
# In CI pipeline script:

# 1. Check if baseline exists
if [ -f ".gitleaks-baseline.json" ]; then
  # Incremental scan - only new secrets
  gitleaks detect \
    --baseline-path .gitleaks-baseline.json \
    --report-path new-findings.json \
    --report-format json \
    --exit-code 1  # Fail on new secrets
else
  # Initial scan - create baseline
  gitleaks detect \
    --report-path .gitleaks-baseline.json \
    --report-format json \
    --exit-code 0  # Don't fail on first scan
fi

# 2. Generate SARIF for GitHub Security tab
if [ -f "new-findings.json" ] && [ -s "new-findings.json" ]; then
  gitleaks detect \
    --baseline-path .gitleaks-baseline.json \
    --report-path results.sarif \
    --report-format sarif
fi
```

### Pattern 4: Custom Rule Development

Add organization-specific secret patterns:

```toml
# Add to .gitleaks.toml

[[rules]]
id = "acme-corp-api-key"
description = "ACME Corp Internal API Key"
regex = '''(?i)acme[_-]?api[_-]?key[\s]*[=:][\s]*['"]?([a-f0-9]{40})['"]?'''
secretGroup = 1
tags = ["api-key", "acme-internal"]

# Test custom rules
# gitleaks detect --config .gitleaks.toml -v
```

## Integration Points

### CI/CD Integration

- **GitHub Actions**: Use `gitleaks/gitleaks-action@v2` for native integration with Security tab
- **GitLab CI**: Docker-based scanning with artifact retention for audit trails
- **Jenkins**: Execute via Docker or installed binary in pipeline stages
- **CircleCI**: Docker executor with orb support
- **Azure Pipelines**: Task-based integration with results publishing

### Security Tools Ecosystem

- **SIEM Integration**: Export JSON findings to Splunk, ELK, or Datadog for centralized monitoring
- **Vulnerability Management**: Import SARIF reports into Snyk, SonarQube, or Checkmarx
- **Secret Management**: Integrate findings with HashiCorp Vault or AWS Secrets Manager rotation workflows
- **Ticketing Systems**: Automated Jira/ServiceNow ticket creation for remediation tracking

## Advanced Configuration

### Entropy-Based Detection

For secrets without clear patterns, use Shannon entropy analysis:

```toml
[[rules]]
id = "high-entropy-strings"
description = "High entropy strings that may be secrets"
regex = '''[a-zA-Z0-9]{32,}'''
entropy = 4.5  # Shannon entropy threshold
secretGroup = 0
```

### Composite Rules (v8.28.0+)

Detect secrets spanning multiple lines or requiring context:

```toml
[[rules]]
id = "multi-line-secret"
description = "API key with usage context"
regex = '''api_key[\s]*='''

[[rules.composite]]
pattern = '''initialize_client'''
location = "line"  # Must be within same line proximity
distance = 5       # Within 5 lines
```

### Global vs Rule-Specific Allowlists

```toml
# Global allowlist (highest precedence)
[allowlist]
description = "Organization-wide exceptions"
paths = ['''vendor/''', '''node_modules/''']

# Rule-specific allowlist
[[rules]]
id = "generic-api-key"
[rules.allowlist]
description = "Exceptions only for this rule"
regexes = ['''key\s*=\s*EXAMPLE''']
```
