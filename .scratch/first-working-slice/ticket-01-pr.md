## Summary

The repository had no public studio authoring loop. Ticket 01 adds a local studio
that finds a standalone neutral draft, compares isolated brand variations, and
delivers self-contained static HTML from its saved source. Lookup, inspection,
rendering, and export share public operations with a stopped-gallery CLI.

Owner source, brand roles, local resources, and brief live in the neutral workspace.
Deliveries retain file digests, dirty-source state, selected variation, dimensions,
and renderer settings; failures preserve source and prior deliveries. Superseded
lab preview/HTML paths are retired, with part/PDF probes retained for tickets 04/06.

Ticket: [.scratch/first-working-slice/issues/01-standalone-figure.md](issues/01-standalone-figure.md).

## Verification

Types, targeted lint, formatting and diff checks passed. All 12 affected Node
tests, 6 Chromium scenarios, and 3 ordinary visual comparisons passed. Inspected
640 × 360 light/dark HTML copied outside the workspace with the studio stopped,
networking and artifact JavaScript disabled. Also inspected changed heading
typography in a newly added variation, side-by-side previews, and the narrow shell.
Actual development saves exercised refresh, broken-token diagnostics, and repair.

Evidence: [.scratch/first-working-slice/ticket-01-evidence.md](ticket-01-evidence.md).
Remote clean-checkout, native Windows/macOS, and CI remain pending; no full local
gate or external presentation import is claimed.

## Review notes

Independent Standards and Spec reviews cleared the final changes. Review findings
about metadata/source races and missing-workspace diagnostics were fixed with
regressions. Actual typography inspection found and fixed invalid generated CSS
font identifiers. See [the review record](.scratch/first-working-slice/ticket-01-review.md).

The public contract currently covers standalone drafts with HTML only. Lifecycle
capture and runtime workspace-module dependencies begin in ticket 02. Platform
setup requires the pinned Chromium browser and its system libraries.
