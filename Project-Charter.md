# An agent-native visual studio starter

## The idea

A forkable development environment for people who make technical visual material with coding agents. It starts with a small, working system for authoring React, SVG, and HTML; previewing the result; and exporting figures, slide graphics, pages, and designed documents. The owner supplies their brands and source material. Their agent helps create each piece in code and improves the reusable system as it goes.

The central promise is simple: **make one useful piece now, and leave behind a better starting point for the next one.** A diagram node becomes a reusable component. A series of briefs becomes a document template. An effective review procedure becomes an agent skill. Everything useful remains in the repository, where future sessions can find it, change it, and build upon it.

This is a *starter for an evolving creative development environment*. The local application is its window into the work: it lets people browse examples, preview compositions, inspect what they use, and export finished pieces. The repository is where the work and the instructions for making it live. The agent is the primary means of creating and changing compositions.

## Who it is for

The first user is comfortable with a repository, Git, and a coding agent such as Codex or Claude Code. They might be a technical founder, engineer, consultant, developer advocate, or small technical marketing team. They regularly need diagrams, figures, product briefs, slide graphics, explainers, and polished documents, and they want those pieces to share a recognizable visual language.

The studio uses agent-authored layouts with focused controls; a general canvas editor is outside the product direction. The user says what a piece needs to communicate, sees an actual preview, gives visual feedback, and retains editable source. Controls such as selecting a brand variation, choosing an export size, or editing declared content support that workflow. Layouts are authored in code, with structured metadata and references, companion Markdown for narrative content, and injected brand tokens. See the [source-model decision](docs/adr/0006-code-authored-compositions.md).

Efficient agent navigation and clear authoring rules are core product requirements.
The workspace must make relevant brand guidance, approved examples, reusable parts,
and prior feedback easy to find without reading everything. The studio reinforces
checkable contracts through useful diagnostics, while agents and owners review
visual quality in actual previews and exports. See the
[agent authoring support decision](docs/adr/0008-agent-authoring-support.md).

## The operating loop

1. **Start with a brief.** Name the audience, purpose, destination, dimensions, message, and source material. The brief is saved, so a later agent session can resume it.
2. **Find useful precedents.** Before making anything new, the agent looks at relevant examples, existing components, templates, brand guidance, and past artifacts. It can say what it will reuse and where a new part is needed.
3. **Build in source.** Figures can be SVG or React components; longer compositions can combine those with HTML, CSS, and structured content. The output remains understandable and editable as code.
4. **Review the actual result.** The local gallery renders the piece at its intended size. The user comments on concrete issues: “move the callout,” “make this legible on a slide,” or “the second page is crowded.” The agent revises and inspects it.
5. **Export and retain.** The same composition produces the preview and deliverable. Export HTML, PDF, PNG, or native SVG where the source supports it. Record the source revision used for the export.
6. **Improve the system selectively.** If a part will help again, promote it to a shared component, template, or skill with an example. If it is specific to one piece, leave it there. The agent records what was added and where it can be used.

The recurring experience matters more than the first impressive image. The strongest test is whether the *third* deliverable is easier to make, more consistent, and still easy to revise.

## Two things the owner grows

The starter should explicitly support two kinds of customization:

| Layer | What the owner changes | How the agent uses it |
| --- | --- | --- |
| **The visual system** | Brands, tokens, type, marks, components, document shells, figure patterns, templates, assets, and examples. | Discovers and reuses established visual language; proposes additions when the current library does not fit. |
| **The authoring practice** | Skills, agent instructions, review checklists, workflows, export commands, and conventions for deciding what becomes reusable. | Applies the owner's preferred way of briefing, building, reviewing, and finishing work across sessions. |

Neither should require upstream changes. A brand is more than a color palette: it includes typography, spacing, visual examples, terminology, audience, and any claims or facts the owner has explicitly supplied. The agent should distinguish approved guidance from references that are only inspiration.

Agent guidance should be short at the root and specific where the task calls for it. The root guide tells the agent how to discover the workspace and run previews. Focused, versioned skills cover tasks such as *create a diagram*, *turn an artifact into a template*, *adapt a piece to another brand*, and *review a print export*. Agent-specific adapter files may point to the same canonical guidance when tools expect different conventions. The brand and project files supply context; they should not become giant, duplicated prompts.

## A workspace for several brands and projects

One repository can serve several brands. Each brand owns its identity, assets, guidance, and brand-specific components. Projects are separate bodies of work that choose a brand and collect their briefs, source content, artifacts, and exports. A user can create a branch for a substantial new project or visual experiment, review the change in Git, and merge useful shared additions back. A branch is a workflow choice, not a substitute for the project directory.

A possible starting structure:

```text
AGENTS.md                       Short orientation and discovery rules
agent/skills/                   Canonical task workflows and review guidance
studio/                         Maintained preview, registry, and export code
shared/components/              Brand-neutral figure and document primitives
shared/templates/               Reusable starting compositions
brands/
  acme/
    brand.md                    Intent, audience, voice, usage guidance
    tokens.ts                   Semantic colors, typography, spacing
    assets/                     Logos, fonts, approved imagery
    components/                 Brand-specific visual parts
    examples/                   Approved visual precedents
  another-brand/
    ...
projects/
  product-launch/
    project.md                  Chosen brand, goals, scope, source links
    references/                 Source material and inspiration
    briefs/                     Durable requests and feedback
    artifacts/                  Editable figures, pages, and documents
    exports/                    Delivered snapshots
```

An artifact names its brand and declares its dependencies. Shared components should be brand-neutral and receive semantic tokens from the selected brand. Brand-specific parts live under that brand; project-specific experiments begin under the project. Cross-brand reuse is an explicit adaptation, not an automatic assumption. If a design works for several brands, the agent can extract a neutral primitive without copying one brand's marks or colors into shared code.

For example, a systems diagram built for one product launch may lead to a reusable labeled-node and connector component under `shared/`. Its particular architecture, copy, and arrangement stay in the project. Another brand can use the component with its own typography and colors while retaining its own diagram content.

This is a proposed layout, not a prescribed framework or current repository structure. The first version only needs enough metadata to discover examples and render artifacts; it does not require a database or complex dependency engine.

## What ships in the public starter

A useful first release is a repository someone can fork, install, run, and use to export a real piece in one session:

- A neutral theme, a small set of figure primitives, and one good example each of a diagram, a slide-sized figure, and a short document.
- A local gallery with brand and project filters, artifact previews, and export actions. A simple command and file watcher can power it.
- Clear contracts for a brand, project, brief, artifact, component, and template; simple files and metadata are sufficient.
- Root agent guidance plus a handful of demonstrated skills: brief a piece, search before building, preview and inspect, export, and promote proven work to a reusable part.
- A setup path that creates the first brand and project from a few choices and optionally accepts a logo, example, or existing guide. Starting with the neutral theme must remain possible.
- Portable HTML export is a priority for the first working slice, alongside PNG and capability-dependent PDF and native SVG. Initial deliverables are static. HTML delivery must work independently of the studio; single-file versus bundled packaging remains to be exercised. The available formats should be stated per artifact.
- Complete rendered slides plus direct, independent export of their used figures, assets, and visual subcomponents, including nested parts. A slide may serve as an ideation reference while its parts are assembled in another tool. Native editable presentation export is deferred to the [roadmap](docs/roadmap.md).

The minimum app is a preview and library browser, not the sole way to author. The first agent handoff can be a saved brief with a **Copy agent request** action. Integration that launches a coding agent from the browser can come later if a particular environment supports it reliably.

Likewise, user interface editing of document copy, visual dependency graphs, generalized extensions, migration machinery, sophisticated reference extraction, and a universal template language can wait until actual use demands them. Ordinary Git history already provides a useful first revision and review mechanism. The first public release should make the core authoring loop feel complete.

## Design rules for reusable work

- **Search before creating.** The agent should inspect relevant examples and parts, then either reuse one, adapt it locally, or explain why a new part is warranted.
- **Preserve established work.** Drafts allow direct revision. An owner can take an item out of draft, and using it in another composition automatically protects the included item while the parent can remain a draft. Later changes create a named derivative by cloning or extending the original; existing uses retain their references. Injected brand values continue to update across originals and derivatives.
- **Promote after evidence.** A one-off artifact is allowed to be specific. Extract a shared component when a second use exposes the stable interface, or when the user expressly wants one.
- **Keep content and composition separable where helpful.** Repeated documents benefit from named content fields or Markdown and a stable layout. Novel figures can remain ordinary source code.
- **Show the contract through examples.** A reusable component has a clear purpose, props, one or two examples, and a preview. A template shows what changes between instances.
- **Inspect the delivered form.** A layout that looks good in a browser can fail when printed, shrunk onto a slide, or rendered with longer text. Review at the intended dimensions before export.
- **Preserve the owner's decisions.** Brand rules, accepted examples, brief history, and useful review feedback belong in files. Future agent sessions should be able to continue without reconstructing a prior conversation.

## Why share it, and how to test the idea

The interesting claim is not that code can draw diagrams. Many tools already do that. The claim is that a technically comfortable person can grow a coherent, personal production environment by collaborating with an agent, and that their reusable assets and authoring habits make successive pieces better and faster.

Publish the starter as a focused open-source experiment if the neutralized version can already complete its core loop. A short demonstration should show one brand being established, a figure being created and exported, and a second piece reusing a part from the first. Keep Pipelign material as an optional example or private workspace so the starter is genuinely reusable.

Try it with a few people who have different brands and real deliverables. Watch whether they can start without your help, whether the agent finds an existing part before inventing another, whether exports survive ordinary changes, and whether they return to make a second and third piece. Those observations should determine whether to invest in a richer app or extension system.

The public description can stay concrete: **“A forkable visual studio for coding agents. Build diagrams, figures, and documents in code, then grow your own brand system, component library, and authoring workflows as you use it.”**
