# Inject brand variations through semantic tokens

Status: accepted, September 24, 2026, from the owner's explicit design requirement.

Every authored composition receives its brand as an explicit rendering dependency
and references colors, fonts, and other brand-controlled values by semantic token
ID. Brand edits update all dependent live artifacts, and each artifact supports
every variation of its selected brand. Adding a variation creates additional
studio views of the same sources, keeping updates consistent without multiplying
authored copies or requiring per-artifact restyling.

Token identities and their descriptions are shared across variations; values
vary. Sensible starter roles remain extensible with owner-defined roles. Agents
choose roles using their descriptions and retain the references in source. Every
variation must resolve required roles, with explicit defaults allowed. Concrete
schema, injection mechanism, and gallery layout remain unselected.

Fixed assets retain their appearance unless explicitly replaced. Exports capture
a resolved brand variation and stay fixed after delivery. Automatic adaptation
across unrelated brands is a separate question from supporting all variations of
one brand. The stricter authoring contract requires token completeness and review
across variations, in exchange for automatic propagation of brand changes.
