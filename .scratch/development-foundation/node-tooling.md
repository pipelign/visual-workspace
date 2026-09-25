# Node-only deterministic tooling

Status: implemented and independently reviewed, September 24, 2026.

Historical record: the owner subsequently chose to remove dedicated script tests
and favor targeted local checks with full-suite execution in CI. The 28 tooling
cases below record migration-time evidence and are no longer in the suite. See
[the current testing policy](../../docs/testing.md#select-local-checks).

The owner requested Node for all deterministic project tooling. The migration
replaces the repository's sole Python executable while preserving the existing
skill-integrity contract. No package dependencies or product behavior changed.

## Changes

- Replaced scripts/check_agent_setup.py with scripts/check-agent-setup.ts using
  Node built-ins. Checks cover locked revision/selection, snapshot bytes and file
  inventory, upstream license, skill metadata, explicit invocation policy,
  canonical adapter symlinks, Claude imports, and referenced guidance.
- Kept pnpm check:agents, pnpm check:env, and pnpm check as the public commands.
  The task wrapper invokes the current Node executable. The checker also runs
  directly before package installation: node scripts/check-agent-setup.ts.
- Removed Python setup from CI; standalone agent CI installs the pinned Node.
  The existing Linux, native Windows, and macOS quality matrix uses the new path.
- Added native NodeNext/erasable-syntax checks for scripts and 28 real-filesystem
  regression tests to the existing Vitest suite. The application/test config and
  native script config are both checked by pnpm typecheck and pnpm check.
- Updated setup instructions, the engineering policy, and skill-workflow guidance.
  Unchanged vendored Bash templates describe human-guided interactive workflows;
  they are not required deterministic project tooling. Generated deterministic
  project scripts follow the Node policy.

## Evidence

Observed failing regressions for the absent Node implementation, missing explicit
invocation-policy validation, flattened adapters, and missing guidance before the
corresponding implementation passed. Fixed fixture hashes and deliberate file
corruption preserve the previous checker's observable validation behavior.

Final checks on Linux/WSL, Node 24.19.0:

- Standalone Node checker and pnpm check:env passed.
- pnpm check passed: skill integrity, both TypeScript configurations, typed lint,
  formatting, 31 Node tests (28 tooling + 3 renderer), production lab builds,
  5 Chromium checks, and 3 ordinary visual comparisons.
- CLI regression fixtures ran the checker and task wrapper from another working
  directory, with an empty PATH, no installed packages, and paths containing
  spaces, Unicode, and a reserved character. Failure tests verified nonzero exit
  status and useful stderr diagnostics.
- Local documentation links and git diff --check passed. Repository-owned code
  and CI have no Python interpreter calls; research retains clearly marked history.

The environment used the same temporary pnpm/browser caches and Linux library
paths recorded in [the foundation status](status.md). Native Windows/macOS and
remote CI have not run here. Rendering code and visual baselines were unchanged.

## Independent Standards review

0 material findings. The reviewer examined the task-scoped diff, complete checker,
regression suite, configuration, CI, and documentation. Portable Node APIs,
argument-array subprocesses, dependency-free bootstrap, separate native typing,
useful diagnostics, and meaningful filesystem fixtures follow the standards.
No extra dependencies or unnecessary abstractions were introduced. This review
did not rerun the full gate or execute native Windows/macOS.

## Independent Spec review

0 material findings. The reviewer confirmed the runtime migration, preservation
of validation behavior and failure diagnostics, and removal of the Python setup
requirement. They independently ran the standalone checker and all 28 tooling
regressions successfully. Their execution was also Linux/WSL only.

## Review scope

Starting commit: 90c49f02f454fa881e170793ee63dd65aa6f3e10. The foundation was
already uncommitted, so reviewers compared this migration against the pre-turn
working-tree snapshot in /tmp/visual-workspace-node-tooling-before-VCCixf and
inspected the new files in full. The prior foundation was not treated as newly
requested scope. This record and the status link were added after review;
executable source was unchanged. No product tickets were published.
