# Agent skills

## Installed snapshot

This repository vendors all 25 skills from the `engineering` and `productivity`
categories of [mattpocock/skills](https://github.com/mattpocock/skills), including
their supporting files and original invocation policies. The source revision is
[`c55ee46073ed923f86ce59a5eb3b6d895095d1b7`](https://github.com/mattpocock/skills/commit/c55ee46073ed923f86ce59a5eb3b6d895095d1b7),
dated September 18, 2026, the latest `main` when fetched on September 24, 2026.

The [lock manifest](../../.agents/matt-pocock-skills.lock.json) records source paths
and SHA-256 hashes. The upstream [MIT license](../../third_party/mattpocock-skills/LICENSE)
is retained. Skill contents are unchanged. Experimental, deprecated, and
miscellaneous skills are outside this selection.

## Discovery and invocation

- Canonical files: `.agents/skills/<name>/`, discovered by Codex.
- Claude Code: `.claude/skills/<name>` is a relative symlink to the canonical
  folder. Root `CLAUDE.md` imports `AGENTS.md`; edit the canonical guidance.
- Codex CLI/IDE: select with `$skill-name` or `/skills`.
  Claude Code: use `/skill-name`. Other hosts can read the relevant `SKILL.md`
  directly if native skill invocation is unavailable.
- Newly installed skills are available on the next turn. If the host does not
  refresh discovery, restart the session.
- Preserve upstream explicit-only policies. Orchestration skills are chosen by
  the user; reference skills can be selected when their task descriptions fit.
- Git must preserve symbolic links. On Windows, use a checkout with symlink
  support, such as WSL. The setup checker reports flattened or broken adapters.

Discovery follows the official [Codex skill documentation](https://developers.openai.com/codex/skills)
and [Claude Code skill documentation](https://code.claude.com/docs/en/skills);
the instruction import follows [Claude's memory documentation](https://code.claude.com/docs/en/memory).
A global installation is unnecessary for this repo and may produce duplicate
skill names.

## Which skill to reach for

Use skills in proportion to the task. A small, clear change can go directly to
implementation and verification. A consequential product or interface ambiguity
benefits from discussion before implementation.

| Situation | Skills |
| --- | --- |
| Choose a workflow | `ask-matt` |
| Resolve product or design questions | `grill-with-docs`, `grill-me`, `grilling`, `domain-modeling` |
| Specify and split substantial work | `to-spec`, `to-tickets`, `wayfinder` |
| Implement and verify behavior | `implement`, `tdd`, `diagnosing-bugs` |
| Design or review interfaces and changes | `codebase-design`, `improve-codebase-architecture`, `code-review` |
| Gather evidence or explore a design | `research`, `prototype` |
| Maintain work and repository configuration | `triage`, `resolving-merge-conflicts`, `setup-matt-pocock-skills` |
| Write agent guidance or transfer context | `writing-for-agents`, `handoff` |
| Support human work | `wizard`, `teach`, `to-questionnaire`, `wait-what` |

Each name resolves to `.agents/skills/<name>/SKILL.md`. Read that entrypoint and
only the references its current task requires. These are engineering and general
workflow skills; visual authoring skills will be added when demonstrated against
a working studio.

## Repository interpretation

The repo's guidance and the user's current instructions determine scope. Preserve
existing authorization and accepted decisions when applying an upstream workflow:

- Specs and tickets use [local files](issue-tracker.md) by default. The bootstrap
  supplies the three configuration docs expected by Matt's skills: issue tracker,
  [triage labels](triage-labels.md), and [domain docs](domain.md). These defaults
  were authored for this project; the interactive upstream setup interview has
  not been run. Reconfigure them when the owner's workflow changes.
- Test interfaces and acceptance criteria already agreed for the task remain
  agreed. Resolve new ambiguity instead of restarting an approval loop.
- Apply [selective verification](../testing.md#select-local-checks) even when an
  upstream workflow suggests an automatic full-suite run or test-first treatment
  for every edit. Add coverage for meaningful behavior, omit routine script
  suites, and leave broad verification to CI unless a concrete concern warrants
  a wider local run. Reviewers reuse evidence instead of repeating checks.
- Some upstream workflows finish by committing, publishing, branching, or
  operating a tracker. Perform those actions only within the user's authorized
  scope. A request to install the skills does not invoke their workflows.
- Deterministic repository automation uses Node. When generating a project
  script from an upstream workflow, use the project runtime and portable Node
  APIs. Vendored human-interaction Bash templates remain an unchanged upstream
  reference; they are not required by the project checks or CI.
- Use the host's available delegation and skill mechanisms. If a workflow calls
  for independent reviewers and those tools are unavailable, disclose that limit;
  a sequential self-review is not an independent review.
- The upstream `code-review` compares committed revisions. For uncommitted work,
  explicitly include staged, unstaged, and new files in the review scope. An
  empty commit diff does not mean the working tree has been reviewed. For an
  ongoing task, use its recorded starting commit as the review base. Ask for a
  base only when the intended scope cannot be recovered from task context.
  Substantive code changes require this independent review under the owner's
  [engineering policy](../engineering.md#review-and-compatibility-policy).

## Extending and updating

Add owner-authored skills under a distinct `.agents/skills/<name>/` directory,
with a focused description and working examples. Add the matching relative
symlink under `.claude/skills/`. Keep changes to owner guidance and project
configuration outside the vendored skill directories when possible.

To update Matt's snapshot:

1. Fetch the upstream repository into a temporary directory, resolve the desired
   commit, and inspect the changes to the selected skills and their dependencies.
2. Compare the current files with the recorded revision before replacing them.
   Preserve any intentional local modifications for explicit reconciliation.
3. Copy the selected skill directories from the reviewed commit, including
   supporting files and `agents/openai.yaml`. Preserve the upstream license and
   update Claude adapters if the selection changes.
4. Update the lock manifest's revision, fetch date, source paths, and per-file
   SHA-256 hashes from that upstream checkout, not from unexplained local edits.
   Update this guide's revision and selection.
5. Run `node scripts/check-agent-setup.ts` (or `pnpm check:agents`), review the full diff, and confirm
   discovery in the agent hosts used by the project.

There is no automatic update step or dependency on a global installer. The
checker detects drift against the recorded snapshot; it does not authenticate
upstream or prove that a skill's instructions are appropriate. Review changed
instructions as code.
