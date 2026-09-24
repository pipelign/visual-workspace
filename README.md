# visual-workspace

A forkable visual workspace for coding agents. Build diagrams, figures, and
documents in code, then grow a reusable visual system and authoring practice.

This repository is at the project and agent-setup stage. There is no runnable
studio yet. The [project charter](Project-Charter.md) describes the intended
authoring loop; [architecture notes](docs/architecture.md) distinguish the studio,
owner workspace, and starter, including the open app/library packaging question.

## Working with an agent

Open this repository in Codex or Claude Code. Start with
[AGENTS.md](AGENTS.md), the canonical project guidance; `CLAUDE.md` imports it.
Matt Pocock's engineering and productivity skills are included locally, pinned to
a reviewed upstream revision. See the [skill guide](docs/agents/skills.md) for
the catalog, invocation, installation details, and update procedure.

Useful starting requests:

- “Help resolve the studio/workspace boundary using `grill-with-docs`.”
- “Implement this agreed studio capability using `tdd`.”
- “Review this branch against the spec and our engineering standards.”

Owner work will include requests such as “Create a figure for this project's
brief using this brand.” Those authoring capabilities still need to be built and
demonstrated. The included skills support engineering the system.

## Check this setup

With Python 3.10 or newer:

```sh
python3 scripts/check_agent_setup.py
git diff --check
```

CI runs the setup check. Application installation, preview, export, and validation
commands will arrive with the first executable slice, following the
[engineering guide](docs/engineering.md).
