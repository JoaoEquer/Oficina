---
name: secrets-gitleaks
description: >
  Hardcoded secret detection and prevention in git repositories and codebases using Gitleaks.
  Identifies passwords, API keys, tokens, and credentials through regex-based pattern matching
  and entropy analysis. Use when: (1) Scanning repositories for exposed secrets and credentials,
  (2) Implementing pre-commit hooks to prevent secret leakage, (3) Integrating secret detection
  into CI/CD pipelines, (4) Auditing codebases for compliance violations (PCI-DSS, SOC2, GDPR),
  (5) Establishing baseline secret detection and tracking new exposures, (6) Remediating
  historical secret exposures in git history.
version: 0.1.0
maintainer: SirAppSec
category: devsecops
tags: [secrets, gitleaks, secret-scanning, devsecops, ci-cd, credentials, api-keys, compliance]
frameworks: [OWASP, CWE, PCI-DSS, SOC2, GDPR]
dependencies:
  tools: [gitleaks, git]
references:
  - https://github.com/gitleaks/gitleaks
  - https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/
  - https://cwe.mitre.org/data/definitions/798.html
---

<!-- Fonte: github.com/majiayu000/claude-skill-registry-data, security/secrets-gitleaks/SKILL.md
     (autor atribuído: SirAppSec; repo agregador sem LICENSE próprio detectado no GitHub — conteúdo é
     documentação de uso de uma ferramenta open-source real, gitleaks/gitleaks, sem claim de autoria
     original sobre o gitleaks em si). Copiado verbatim 2026-09-01 após leitura completa (duas vezes,
     mesmo veredito). Ver skills-radar.md (seção H).

     O upstream listava scripts/references/assets que não existem (só SKILL.md + metadata.json);
     essa seção foi removida. Não há script de instalação: escreva o hook inline seguindo
     "Pre-Commit Hook Protection" abaixo.
     Adaptação 2026-11-24: regras da casa no topo (sem --no-verify, reescrita e force push só com
     aval); padrões, integrações, compliance e config avançada movidos para references/. -->

# Secrets Detection with Gitleaks

House rules (Oficina adaptation, these win over anything below):

- A secret found in history is rotated first. Rotation is the fix; a history rewrite only limits further exposure.
- Never run `git commit --no-verify`, a history rewrite (`git filter-repo`, BFG) or `git push --force` on your own. Stop, show what would change, and wait for the user's explicit go: a rewrite breaks every clone and open branch, and a force push cannot be taken back.
- Never print a found secret in full; use `--redact`.

## Contents

- Overview
- Quick Start
- Core Workflows
- Troubleshooting
- References

## Overview

Gitleaks is a secret detection tool that scans git repositories, files, and directories for hardcoded credentials including passwords, API keys, tokens, and other sensitive information. It uses regex-based pattern matching combined with Shannon entropy analysis to identify secrets that could lead to unauthorized access if exposed.

This skill provides comprehensive guidance for integrating Gitleaks into DevSecOps workflows, from pre-commit hooks to CI/CD pipelines, with emphasis on preventing secret leakage before code reaches production.

## Quick Start

Scan current repository for secrets:

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or: docker pull zricethezav/gitleaks:latest

# Scan current git repository
gitleaks detect -v

# Scan specific directory
gitleaks detect --source /path/to/code -v

# Generate report
gitleaks detect --report-path gitleaks-report.json --report-format json
```

## Core Workflows

### 1. Repository Scanning

Scan existing repositories to identify exposed secrets:

```bash
# Full repository scan with verbose output
gitleaks detect -v --source /path/to/repo

# Scan with custom configuration
gitleaks detect --config .gitleaks.toml -v

# Generate JSON report for further analysis
gitleaks detect --report-path findings.json --report-format json

# Generate SARIF report for GitHub/GitLab integration
gitleaks detect --report-path findings.sarif --report-format sarif
```

**When to use**: Initial security audit, compliance checks, incident response.

### 2. Pre-Commit Hook Protection

Prevent secrets from being committed in the first place:

```bash
# Install pre-commit hook (run in repository root)
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
gitleaks protect --verbose --redact --staged
EOF

chmod +x .git/hooks/pre-commit
```

**When to use**: Developer workstation setup, team onboarding, mandatory security controls.

### 3. CI/CD Pipeline Integration

#### GitHub Actions

```yaml
name: gitleaks
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### GitLab CI

```yaml
gitleaks:
  image: zricethezav/gitleaks:latest
  stage: test
  script:
    - gitleaks detect --report-path gitleaks.json --report-format json --verbose
  artifacts:
    paths:
      - gitleaks.json
    when: always
  allow_failure: false
```

**When to use**: Automated security gates, pull request checks, release validation.

### 4. Baseline and Incremental Scanning

Establish security baseline and track only new secrets:

```bash
# Create initial baseline
gitleaks detect --report-path baseline.json --report-format json

# Subsequent scans detect only new secrets
gitleaks detect --baseline-path baseline.json --report-path new-findings.json -v
```

**When to use**: Legacy codebase remediation, phased rollout, compliance tracking.

### 5. Configuration Customization

Create custom `.gitleaks.toml` configuration:

```toml
title = "Custom Gitleaks Configuration"

[extend]
# Extend default config with custom rules
useDefault = true

[[rules]]
id = "custom-api-key"
description = "Custom API Key Pattern"
regex = '''(?i)(custom_api_key|custom_secret)[\s]*[=:][\s]*['"][a-zA-Z0-9]{32,}['"]'''
tags = ["api-key", "custom"]

[allowlist]
description = "Global allowlist"
paths = [
  '''\.md$''',           # Ignore markdown files
  '''test/fixtures/''',  # Ignore test fixtures
]
stopwords = [
  '''EXAMPLE''',         # Ignore example keys
  '''PLACEHOLDER''',
]
```

**When to use**: Reducing false positives, adding proprietary secret patterns, organizational standards.

Ready-made patterns (first audit, workstation setup, CI with baseline, custom rules), integration points, compliance mapping and advanced configuration (entropy, composite rules, allowlists): [references/patterns-and-config.md](references/patterns-and-config.md).

## Troubleshooting

### Issue: Too Many False Positives

**Solution**:
1. Review findings to identify patterns: `grep -i "example\|test\|placeholder" gitleaks-report.json`
2. Add to allowlist in `.gitleaks.toml`:
   ```toml
   [allowlist]
   paths = ['''test/''', '''examples/''', '''\.md$''']
   stopwords = ["EXAMPLE", "PLACEHOLDER", "YOUR_API_KEY_HERE"]
   ```
3. Use commit allowlists for specific false positives:
   ```toml
   [allowlist]
   commits = ["commit-sha-here"]
   ```

### Issue: Performance Issues on Large Repositories

**Solution**:
1. Use `--log-opts` to limit git history: `gitleaks detect --log-opts="--since=2024-01-01"`
2. Scan specific branches: `gitleaks detect --log-opts="origin/main"`
3. Use baseline approach to scan only recent changes
4. Consider shallow clone for initial scans: `git clone --depth=1000`

### Issue: Pre-commit Hook Blocking Valid Commits

**Solution**:
1. Add inline comment to bypass hook: `# gitleaks:allow`
2. Update `.gitleaks.toml` allowlist for the specific pattern
3. Use `--redact` to safely review findings: `gitleaks protect --staged --redact`
4. Review with security team if pattern is genuinely needed

Do not bypass the hook with `--no-verify`: fix the finding or allowlist it, so the decision is recorded.

### Issue: Secrets Found in Git History

**Solution**:
1. Rotate compromised credentials immediately (highest priority). Report which secret, where, and since which commit.
2. Propose, do not run, a history rewrite. For a public repository it is usually worth it; show the user the plan:
   - `git filter-repo` (recommended): `git filter-repo --path-glob '*.env' --invert-paths`
   - BFG Repo-Cleaner: `bfg --delete-files credentials.json`
3. Only after the user's explicit go: run the rewrite on a fresh clone, then the user pushes the cleaned history (`git push --force` rewrites the remote for everyone).
4. Notify all contributors to rebase/re-clone
5. Document incident in security audit log

### Issue: Custom Secret Patterns Not Detected

**Solution**:
1. Develop regex pattern: Test at regex101.com with sample secrets
2. Add custom rule to `.gitleaks.toml`
3. Test pattern: `gitleaks detect --config .gitleaks.toml -v --no-git`
4. Consider entropy threshold if pattern is ambiguous:
   ```toml
   [[rules.Entropies]]
   Min = "3.5"
   Max = "7.0"
   Group = "1"
   ```

## References

- [Gitleaks Official Documentation](https://github.com/gitleaks/gitleaks)
- [OWASP A07:2021 - Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- [CWE-798: Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html)
- [CWE-259: Use of Hard-coded Password](https://cwe.mitre.org/data/definitions/259.html)
- [CWE-321: Use of Hard-coded Cryptographic Key](https://cwe.mitre.org/data/definitions/321.html)
