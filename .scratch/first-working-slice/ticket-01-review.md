# Ticket 01 independent review

Reviewed all tracked changes and new files against starting commit
`890d52a229cf6de069087e619b12f18aba3806db`, including studio operations/UI,
owner workspace, tests, public contract, tooling, and the local ticket.
Two independent agents reviewed Standards and Spec separately, then reviewed
the material remedies. Reviewers reused the implementer's verification evidence.

## Standards

Initial documented violations:

- Catalog/brand parsing preceded the source snapshot, permitting rendered values
  and recorded bytes to disagree after a concurrent save.
- Missing workspace roots escaped as raw filesystem errors without repair guidance.

Maintenance suggestion: download state depended on displayed English wording.

Resolved: metadata loading retains the exact parsed bytes and checks them against
the source snapshot before composition; root failures now preserve their cause
in `missing-workspace` diagnostics; delivery state is a tagged union. Both hard
violations have regressions observed failing before their fixes.

The reviewer also cleared the later safe CSS font identifiers, browser-backed
heading-role regression, and write-stabilization configuration exercised through
actual development saves and repair. Final outcome: no open Standards findings.

## Spec

Initial finding: the parsed-metadata/source-record race violated actual-source
recording and same-saved-source rendering. The exact-byte consistency check and
public-operation regression resolve it.

The reviewer confirmed standalone lookup/inspection with the gallery stopped,
inspectable broken drafts, variation isolation, owned fixed imagery/local fonts,
unsupported-format rejection, prior-delivery preservation, the public owner
composition boundary, and retirement of the superseded full-figure lab.
The retained part/PDF probes have explicit later-ticket ownership.

The later heading-font and watcher remedies received affected-area review with
no new findings. Final outcome: no open Spec findings or substantive scope creep.

## Completion evidence

After the affected-area reviews, the implementer completed typography inspection,
copied offline/studio-stopped delivery inspection, final Chromium controls and
accessibility checks, and ordinary image comparisons. See
[the evidence record](ticket-01-evidence.md). Remote CI and merge remain pending.
