# visual-workspace

A forkable visual workspace for coding agents. Build diagrams, figures, and
documents in code, then grow a reusable visual system and authoring practice.

This repository has a runnable development quality lab and contribution tooling.
The product studio remains to be built. The [project charter](Project-Charter.md)
describes the intended authoring loop; [architecture notes](docs/architecture.md) distinguish the studio,
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

## Run the development lab

Follow [development setup](docs/development.md) for the pinned Node/pnpm versions
and browser prerequisites on Linux/WSL, native Windows, or macOS. Deterministic
repository tooling runs on Node; no Python installation is required.

After installation:

```sh
pnpm check:env
pnpm dev
```

The neutral lab exercises React/Tailwind previews, portable HTML, and browser
export checks. CI runs the full `pnpm check` gate on all three operating systems.
For local changes, select affected checks using the
[testing policy](docs/testing.md#select-local-checks); a full local run is optional
and should answer a concrete concern.

Read the [engineering standards](docs/engineering.md),
[testing/evidence policy](docs/testing.md), and the linked
[stack evaluations](docs/development.md#why-this-stack) before implementing a
product capability. The lab is an evaluation fixture, not the public authoring
contract.
