# Author layouts in code and keep studio controls focused

Status: accepted, September 24, 2026. The owner explicitly chose agent-authored
layouts with focused studio controls and excluded a general canvas editor.

Compositions are authored and adapted in source code. Structured metadata and
references expose identity, named parts, relationships, dependencies, and export
capabilities. Companion Markdown holds editable narrative content, and the brand
is injected through semantic tokens. A small public studio interface connects
these sources to discovery, rendering, validation, and independent part export.
Exact schemas, language, framework, and content bindings remain open.

The studio provides focused controls for discovery, inspection, declared content
or properties, brand variations, review, lifecycle, and export. Which of those
editing controls ship in the first slice remains an implementation-scope choice.
General dragging, resizing, and arbitrary visual layout editing are outside the
product direction. Onboarding and other guided flows remain compatible with it.
Native editable presentation export stays a separate deferred roadmap capability.

This retains freedom for agents to design layouts in source while giving the
studio explicit contracts it can inspect and operate on. Compositions must expose
their parts through those contracts; the studio cannot rely on guessing semantics
from arbitrary code or pixels. Focused editing writes declared source data through
the same lifecycle rules used by agents, preserving one authoritative source and
requiring derivatives for protected work. A generic canvas document model and
round-trip rewriting of arbitrary layout code are not required.
