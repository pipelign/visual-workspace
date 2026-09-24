# Domain documentation

This repository uses one context. Read root `CONTEXT.md` before exploring product
behavior; use its terms in code, tests, briefs, and discussions.

Read `docs/architecture.md` for current design direction and `Project-Charter.md`
for product intent. When `docs/adr/` exists, read decisions relevant to the work.
Create it only when a real decision needs a durable explanation.

Keep `CONTEXT.md` a compact vocabulary, not a backlog or implementation guide.
Update it when a term is settled. An architectural decision record should explain
the choice and why its tradeoff matters to a future maintainer. Use sequential
`NNNN-slug.md` names and mark proposals, accepted decisions, and superseded
decisions clearly. Do not present an open packaging hypothesis as accepted.

If a request conflicts with an accepted decision, surface the conflict and
resolve the intended direction before changing that contract. Then update the
decision record with the change rather than leaving contradictory guidance.
