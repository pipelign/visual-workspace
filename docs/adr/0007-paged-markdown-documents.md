# Edit paged documents in Markdown and repair layouts with the agent

Status: accepted, September 24, 2026, from the owner's document-editing workflow.

A document is a composition centered on flowing prose. The agent authors its
layout and creates a companion Markdown file for the owner to edit, divided into
pages through clear conventions. The owner can change prose and use Markdown
formatting such as headings, lists, and preformatted text. Saving those edits
refreshes the rendered document using the authored page structure and layout.

Edits may cause overflow or collisions with figures. The owner inspects the result
and asks the agent to repair it when needed. Repairs can resize or replace imagery,
adjust page divisions, or split prose into concrete text areas. Text remains
editable in the companion Markdown after repair. Ordinary text wrapping and flow
within the authored layout are expected; automatic repagination, collision repair,
or editorial rewriting on save are not requirements.

This keeps direct prose editing simple while leaving design repair with the agent.
A successful refresh does not establish that the page still fits or is ready for
delivery. Layout repair preserves the owner's edited copy unless the request
allows editorial adaptation under [ADR 0005](0005-agent-led-composition-adaptation.md).
Preview and export consume the same saved content and composition. Direct editing
applies to drafts; changes to protected documents require a derivative under
[ADR 0002](0002-protected-items-and-derivatives.md).

Page markers may use a comment convention, but exact syntax, page and text-area
identities, content bindings, and figure references remain to be designed. The
Markdown formatting subset and overflow diagnostics need a working example.
This decision establishes the document workflow; it does not settle content
bindings for slides or standalone figures, or require a universal document editor.
