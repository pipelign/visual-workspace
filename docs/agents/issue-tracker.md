# Issue tracker: local Markdown

Local files are the portable bootstrap default, so a fork can use the engineering
skills without credentials or a connection to the upstream project's tracker.
This is an editable repository convention, not a requirement to turn every task
into a ticket. Configure a remote tracker here when the owner chooses one.

## Specs and implementation tickets

- One effort per `.scratch/<feature-slug>/` directory, created when needed.
- Put its spec in `spec.md` and each ticket in `issues/<NN>-<slug>.md`.
- Record `Status:` near the top, using the triage vocabulary in
  [triage-labels.md](triage-labels.md); use `in-progress` and `done` for execution.
- Record `Blocked by:` with ticket paths or numbers within the effort. A ticket
  is ready for implementation once its blockers are `done` and its requirements
  are clear. Append discussion under `## Comments`.
- Keep these durable plans in Git despite the upstream `.scratch` naming.
  Put disposable command output outside this tracker.

When a skill says to publish to the tracker, write the local file. When it says
to fetch a ticket, read that file. Remote issue creation, comments, and PR actions
require a user request; a vendored workflow alone is not permission to publish.

## Wayfinding

Use `.scratch/<effort>/map.md` for Notes, Decisions-so-far, and Fog, with one
question per `issues/NN-<slug>.md`. Record a `Type:` of `research`, `prototype`,
`grilling`, or `task`. Wayfinding uses its own `Status:` values: `open`, `claimed`,
and `resolved`.

Work the lowest-numbered open, unclaimed ticket whose `Blocked by:` tickets are
all resolved. Set `Status: claimed` before working. On completion, append an
`## Answer`, mark it resolved, and add a gist and link under Decisions-so-far in
the map. Preserve source links and unresolved uncertainty in the answer.
