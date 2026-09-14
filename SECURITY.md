# Security policy

## Reporting a vulnerability

Report vulnerabilities privately through GitHub Security Advisories on this
repository, or through the issue tracker on the main
[Melovian](https://github.com/melovian-hq/Melovian) repository if the advisory
flow is unavailable.

Do not open public issues for unpatched vulnerabilities.

## Scope

This repository builds the static Melovian marketing and documentation site.
Findings about the player itself belong on the main repository.

## Supply chain

- pnpm enforces `minimumReleaseAge`, `trustPolicy: no-downgrade`, and
  `blockExoticSubdeps` (see `pnpm-workspace.yaml`).
- All GitHub Actions are pinned to commit SHAs and jobs run behind
  step-security/harden-runner.
- CodeQL and OpenSSF Scorecard run in CI.
