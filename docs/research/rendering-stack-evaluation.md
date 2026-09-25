# Rendering stack evaluation

Status: research recommendation, September 24, 2026. No application dependency,
framework, or output capability has been installed or verified by this note.
The executable probes below remain required before establishing the stack.

Subsequent implementation and actual results are recorded in
[development setup](../development.md) and the
[foundation record](../../.scratch/development-foundation/status.md).

## Decision to make

Choose a small application and rendering stack for the
[first working slice](../../.scratch/first-working-slice/spec.md), following the
[architecture](../architecture.md), [open questions](../architecture-questions.md),
and [engineering standards](../engineering.md). The hard requirements are shared
SVG figures and HTML compositions, independently rendered configured uses, live
semantic brand values, editable paged Markdown, filesystem operations usable
without the gallery, and portable static HTML opened locally with networking
unavailable and the studio stopped. Initial development must include native
Windows, Linux/WSL, and macOS.

Facts below cite first-party documentation or source. Recommendations and design
implications are judgments against these requirements, not demonstrated results.
This research does not select dependency-preservation storage or prove protected
definition behavior; that remains a separate high-risk probe.

## Recommended candidate

Use **TypeScript, React, Vite, and Node.js 24 LTS**, with **Playwright-controlled
Chromium** for PNG and the document PDF probe. Keep the studio's interactive UI
separate from a shared static artifact renderer. Consider **Tailwind CSS and
selected shadcn/ui components for the studio shell**. Use **unified/remark** for
structured Markdown processing and **Zod** at data boundaries. Keep one repository
and one toolchain until a working example establishes a need for package splits.

| Responsibility | Candidate and rationale |
| --- | --- |
| Local runtime and filesystem operations | Node 24 LTS; ordinary modules expose operations shared by the CLI and local server adapter. Keep filesystem, process, and browser effects behind those operations. |
| Studio UI | React with Vite and its official React integration. This supports the requested component ecosystem without making framework routes the artifact model. |
| Artifact authoring | Pure React/TSX components that produce HTML or native SVG from resolved content, explicit dimensions, configured inputs, and injected brand values. |
| Static rendering | Start with `renderToStaticMarkup` after resolving all inputs. The artifact contract excludes effects, browser-only measurement, and suspended content needed for its final appearance. |
| Studio styling | Tailwind and only the shadcn components actually required for controls; maintain their source and accessibility behavior as studio code. |
| Artifact styling | Explicit artifact CSS and per-render semantic values, included in the export. Keep studio theme variables, resets, and interactive dependencies out of artifact documents. |
| Markdown | A unified/remark syntax-tree pipeline with a small documented page/text-area extension. Use the same parsed content for inspection and rendering. |
| Boundary validation | Zod for serializable manifests, brand values, operation inputs, configured props, and output records; domain operations enforce cross-item rules. |
| Browser delivery | Playwright for browser integration tests and Chromium PNG/PDF operations, with browser binaries installed explicitly and versioned with the toolchain. Native SVG uses a separate serializer/capability. |

These choices require no hosted rendering service. Exact compatible dependency
versions, package-manager version, and lockfile belong in the executable toolchain
change, after checking their current requirements. Do not copy unspecified
`latest` commands into reproducibility instructions.

Node's release schedule currently lists 24 as Active LTS, with Maintenance LTS
starting October 20, 2026 and end of life April 30, 2028. Node 26 is Current and is
scheduled to enter LTS October 28, 2026; these dates can change. Node recommends
LTS lines for production use. **Recommendation:** start on a pinned, supported 24.x
patch and revisit the line at a planned upgrade, rather than selecting Current
because its major number is newer. [Node release schedule](https://github.com/nodejs/Release#release-schedule),
[Node release policy](https://nodejs.org/en/about/previous-releases).

Vite supports TSX and has an official React integration, but transpilation does
not type-check the project. Node's native TypeScript support also does not
type-check, ignores `tsconfig.json`, and does not execute `.tsx` files.
**Implication:** run a separate strict TypeScript check; define an explicit
TSX-aware Node development/loading path and a production build path. A Vite
development server alone is not the agent's runtime. The Node documentation gives
`tsx` as one supported approach to full TypeScript execution. The loader probe
must settle how CLI rendering, CSS, asset references, and saved-module refresh
work together. [Vite TypeScript and JSX](https://vite.dev/guide/features),
[Node 24 TypeScript support](https://nodejs.org/docs/latest-v24.x/api/typescript.html).

## Alternatives considered

| Approach | Verified capability | Judgment for this repository |
| --- | --- | --- |
| React + Vite + Node | Vite documents backend integration, development asset handling, production manifests, and middleware mode. | Best initial fit. Shared studio operations and artifact export remain explicit; the local server adapter can stay small. [Vite backend integration](https://vite.dev/guide/backend-integration), [Vite server options](https://vite.dev/config/server-options). |
| React + Next.js on Node | Static export emits HTML per route and supports deployment to a static web server. Request-dependent features and Server Actions are unavailable in static-export mode. | Viable for a larger web application, but its static-site build does not establish independent `file://` artifact delivery. Filesystem writes still require a live local backend; nested part export still needs our own renderer. Route/build conventions add little to the first local loop. Reject for this slice, not as an inherently incompatible framework. [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports). |
| React + Vite with Bun runtime | Bun provides a runtime, package manager, and test runner, and aims for Node compatibility. Its current compatibility table still documents differences in `node:child_process`, `node:module`, and Windows path edge cases. | No measured runtime bottleneck justifies another compatibility surface in the filesystem/process/export path. Keep it an alternative if a measured benefit later exceeds the extra platform verification. This is not a claim that Bun cannot run the application. [Bun overview](https://bun.com/docs), [Bun Node compatibility](https://bun.com/docs/runtime/nodejs-compat). |

## One static artifact path

React explicitly supports `renderToStaticMarkup` for noninteractive HTML, with
no hydration. It returns a string and supports a per-render identifier prefix.
Its Suspense support is limited: suspended components immediately produce their
fallback. **Recommendation:** eagerly resolve saved content, asset records, and
brand values before calling it; render failures must remain failures. Preview the
resulting artifact document inside an isolated frame and export that same document
through the shared renderer. React's static output is a suitable primitive, not a
font loader, packaging system, or proof of final visual completeness.
[React static markup](https://react.dev/reference/react-dom/server/renderToStaticMarkup).

If asynchronous component rendering becomes necessary, the documented
`prerenderToNodeStream` API waits for Suspense data. It does not detect fetching in
effects, and aborted prerenders can contain fallback content. **Implication:**
adopting it would still require completion and error rules; merely switching APIs
would not make exports ready. Prefer the eager first-slice contract until an actual
composition requires this complexity. [React Node prerendering](https://react.dev/reference/react-dom/static/prerenderToNodeStream).

The delivered HTML should initially be tested as a single file containing styles,
resolved brand values, inline SVG, and embedded required fonts/images. Compare it
with a relative asset bundle using the same fixture before settling packaging.
Single-file delivery is the leading hypothesis because it removes missing sibling
files and reduces local-file resource-resolution differences; large assets may
make bundles preferable later. Neither hypothesis is verified yet.

Vite can generate relative asset URLs, and it inlines some imported assets according
to its size limit. Those features do not promise that every font, CSS URL, or
resource will be embedded. Browser module loading also has security restrictions
under `file://`. **Implication:** exporting the studio's Vite build with
`base: './'` is insufficient evidence. Static artifacts should not require the
studio's JavaScript bundle, hydration, remote fetches, or an asset server.
[Vite relative base](https://vite.dev/guide/build#relative-base),
[Vite asset handling](https://vite.dev/guide/assets),
[MDN module loading](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#other_differences_between_modules_and_classic_scripts).

Configured-use export needs its effective inputs, inherited rendering context,
bounds, padding, clipping, intentional background, resource manifest, and selected
variation. **Design recommendation:** resolve a selected use into an independent
render request; test that its appearance matches the containing composition.
Capturing a rectangle from the full slide is not sufficient when neighbors overlap
that rectangle. Repeated uses must resolve separately, and nested SVG definitions
and IDs must remain valid after isolation.

Native SVG is a capability of an actual SVG render entry, not of every React tree.
Do not promise conversion of arbitrary HTML, canvas, or `foreignObject` content
into portable vector artwork. Browser image contexts can prohibit external SVG
resources while allowing inlined data URLs. Test exported SVG both directly and
as an image, then in the intended external tool before claiming import fidelity.
[MDN SVG image restrictions](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image#restrictions).

## Tailwind and shadcn boundaries

shadcn documents a Vite setup and distributes component source for customization;
it is a way to build the studio's component library. Adopt a few controls as needed,
review their generated dependencies, and keep keyboard/focus/error-state checks.
This avoids introducing a second application framework just to use the requested
UI components. [shadcn introduction](https://ui.shadcn.com/docs),
[shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite).

Tailwind scans source as text and requires complete detectable class names; it
does not understand arbitrary class-name interpolation. **Implication:** live brand
values should enter through explicit CSS variables or resolved SVG attributes,
not classes assembled from owner token values. Its source scanner also needs
deliberate configuration if owner modules are outside the studio source tree.
[Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).

Tailwind's default import includes Preflight, which resets margins, headings, and
lists. **Recommendation:** isolate artifact documents from the studio stylesheet;
otherwise plain Markdown and owner CSS can inherit unexpected presentation rules.
Artifacts may use compiled utility CSS if the public authoring contract includes
its generation and packaging. Plain artifact CSS is the smaller initial contract.
The studio's light/dark preference is separate from each artifact's explicit brand
variation. [Tailwind Preflight](https://tailwindcss.com/docs/preflight).

## Markdown and schema boundaries

unified exposes parsing and transformation through syntax trees; its documented
Markdown-to-HTML pipeline uses `remark-parse`, `remark-rehype`, and HTML serialization.
**Recommendation:** use this structure to recognize authored page/text-area markers,
validate bindings, retain source locations, and render the supported Markdown
subset. Keep the original Markdown authoritative; a render pass should not rewrite
it or silently repaginate it. [unified pipeline](https://unifiedjs.com/learn/guide/using-unified/).

`remark-directive` offers an existing extension syntax suitable for controlled
authoring, but its documentation warns that directives are not supported by most
other Markdown tools. Evaluate readable page/area directives against comment
markers; do not describe either as standard Markdown pagination. Include fenced
code containing marker-like text in the parser fixture. MDX supports JSX,
JavaScript expressions, and imports within Markdown; that is useful for executable
content but unnecessary for owner-editable prose whose layout already lives in
TSX. Keep MDX out of the initial content contract. [remark directives](https://github.com/remarkjs/remark-directive),
[MDX syntax](https://mdxjs.com/docs/what-is-mdx/).

Zod can validate runtime inputs, infer TypeScript types, and return structured
issues with paths through `safeParse`. **Recommendation:** use it at file and
operation boundaries, then attach item ID, source location, and repair guidance
to diagnostics. Prefer explicit unknown-key policy and avoid coercion/defaults
that silently hide malformed authored input. A schema cannot prove reference
integrity, protected-dependency preservation, or export fidelity; those belong to
domain operations and browser tests. [Zod basic usage](https://zod.dev/basics),
[Zod object schemas](https://zod.dev/api#objects).

## Browser export and readiness

| Tool | Verified capability | Recommendation |
| --- | --- | --- |
| Playwright | Controls installed browser binaries and supplies screenshots, PDF generation, and the browser test workflow. Each Playwright version requires corresponding browser versions. | Use one browser automation family for integration evidence and export; explicitly install its browsers in setup and CI. Pin and record the renderer/browser combination. [Playwright browsers](https://playwright.dev/docs/browsers), [Page API](https://playwright.dev/docs/api/class-page). |
| Puppeteer | Supports page/element screenshots and PDF generation; PDF waits for fonts by default. | Credible alternative if the export adapter exposes a concrete Playwright limitation. Adding both immediately duplicates browser setup without resolving a known need. [Puppeteer screenshots](https://pptr.dev/guides/screenshots), [Puppeteer PDF](https://pptr.dev/guides/pdf-generation). |
| Paged.js | Supplies a paged-media workflow and a CLI using headless Chromium for PDF. | Defer. Authored pages and ordinary flow are already required, while automatic repagination is outside the slice. Reconsider when a document requires paged-media features the browser probe cannot supply. [Paged.js getting started](https://pagedjs.org/en/documentation/2-getting-started-with-paged.js/). |

Browser readiness needs an explicit operation. `document.fonts.ready` waits for
loading/layout of used fonts, which can differ from declared fonts; it is not
proof that a required face rendered rather than fallback. Image `decode()` resolves
when data is decoded and rejects failed/corrupt images. **Recommendation:** track
required resources, check their loaded state, decode images, wait for layout, and
fail exports with useful diagnostics on missing required resources. Stabilize
animations and declared dimensions before capture; do not substitute a fixed sleep
or network-idle heuristic for readiness. [MDN font readiness](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts),
[MDN image decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode).

Playwright's PDF implementation is available for headless Chromium. PDF uses print
media by default; `printBackground` defaults to false, and `preferCSSPageSize`
defaults to false, which can scale content to another paper size. **Probe:** use
explicit authored page geometry, deliberate media/color settings, background
printing, and CSS page-size preference; inspect the actual two-page PDF. Keep PDF
capability conditional until this works. [Playwright PDF API](https://playwright.dev/docs/api/class-page#page-pdf),
[Playwright PDF dispatcher source](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/dispatchers/pageDispatcher.ts).

## Native Windows and cross-platform support

Playwright's current supported systems include Windows 11+/Windows Server 2019+,
macOS 14+, Debian 12/13, and Ubuntu 22.04/24.04/26.04, with current supported Node
22/24/26 lines. **Recommendation:** document a concrete initial baseline such as
Windows 11, macOS 14+, and Ubuntu 24.04, including WSL2 using a supported Linux
distribution. Native Windows must have a real test job; WSL evidence does not
establish native Windows behavior. Recheck requirements when pinning versions.
[Playwright system requirements](https://playwright.dev/docs/intro#system-requirements).

Use Node scripts for orchestration and filesystem tasks instead of Bash-specific
commands or inline POSIX environment assignments. Node documents that `.cmd`/`.bat`
launching differs on Windows, and signal/process behavior also differs. Prefer
tool APIs or Node entry points with argument arrays; test shutdown and browser
cleanup on each platform. [Node 24 child processes](https://nodejs.org/docs/latest-v24.x/api/child_process.html#spawning-bat-and-cmd-files-on-windows).

Keep logical item IDs separate from filesystem paths and browser URLs. Use Node
path operations and `pathToFileURL`/`fileURLToPath` at those boundaries; the URL
conversion API handles Windows paths and percent-encoding. Include spaces,
non-ASCII names, and URL-significant characters in test paths; check
case-colliding file names instead of relying on one filesystem's behavior.
[Node 24 URL conversion](https://nodejs.org/docs/latest-v24.x/api/url.html#urlpathtofileurlpath-options).

Vite documents a WSL2 watcher limitation when Windows applications edit files,
recommends WSL-side editing and a Linux filesystem, and offers polling with a CPU
cost. Node also documents platform differences in `fs.watch`, including Windows
directory move/delete behavior. **Recommendation:** treat watcher events as hints
to refresh authoritative files, test ordinary and atomic editor saves, provide a
documented polling fallback, and verify moves/deletions. Do not make identity,
protection, or correctness depend on receiving every watcher event.
[Vite WSL watching](https://vite.dev/config/server-options#server-watch),
[Node watch caveats](https://nodejs.org/docs/latest-v24.x/api/fs.html#caveats).

Run install, static checks, filesystem contract tests, build, and a minimal real
render/export smoke test on native Windows, macOS, and Linux. Use one pinned Linux
environment for the principal visual baseline and inspect platform differences;
do not assume identical text rasterization across operating systems. Exercise WSL
editing/watch behavior separately before claiming it. This is a proposed evidence
policy, not CI that currently exists.

## Focused executable probes before accepting the stack

| Probe | Required evidence and consequence |
| --- | --- |
| Node/TSX and resource loading | With the gallery stopped, load a TSX figure through the agent operation, including its CSS/assets; change a transitive module and render again. Repeat from native Windows and a path containing spaces. Settle loader/build/invalidation behavior before expanding UI. |
| Portable HTML | Render document and slide in both variations; compare single-file and relative-bundle packaging. Copy outside the workspace, stop all servers, use a fresh browser context with networking disabled, and open `file://`. Inspect actual fonts, imagery, saved copy, page structure, and links. Record browser/OS and inspect console/resource failures. |
| Configured part export | Render two differently configured uses, including a nested use, independently and in the full slide. Confirm inputs, semantic values, typography, fills, bounds, clipping, transparency, and exclusion of neighbors. Inspect PNG dimensions, standalone SVG where declared, and real destination import separately. |
| Markdown bindings | Edit headings, lists, code, captions, and page/area markers; refresh preview/export. Overflow then repair only layout. Confirm copy survives unchanged and markers inside fenced code stay literal. Exercise diagnostics for missing/duplicate bindings. |
| Completion and failure | Delay and break a required image/font, break a reference/token, and request an unsupported format. Verify incomplete content does not become a successful export and existing unrelated deliveries survive failure. Compare side-by-side variations with separate renders. |
| PDF geometry | Export the authored two-page document; verify page count, physical geometry, content, typography, backgrounds, and clipping from the actual file. Publish a PDF capability only for the exercised source kind. |
| Platform authoring loop | Clean install, start/stop, ordinary and atomic saves, rename/delete, CLI discovery, browser launch/cleanup, and local-file delivery on the three native OS families; perform a separate WSL watcher exercise. |

The research supports this candidate stack, but none of these probes has run.
Retain their output files and observed limitations with the implementation evidence.
A failing probe should change the relevant contract or tool choice explicitly;
it must not silently weaken the accepted delivery requirements.
