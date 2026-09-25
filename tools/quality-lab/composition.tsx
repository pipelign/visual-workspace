export type Variation = 'light' | 'dark';
export type Target = 'figure' | 'delivery';

const palettes = {
  light: {
    canvas: '#f8fafc',
    surface: '#ffffff',
    text: '#172338',
    muted: '#475569',
    accent: '#2160a8',
    border: '#b7c9db',
  },
  dark: {
    canvas: '#101827',
    surface: '#172338',
    text: '#f8fafc',
    muted: '#cbd5e1',
    accent: '#8bd5ff',
    border: '#486075',
  },
};

function NodePart({
  title,
  detail,
  variation,
}: {
  title: string;
  detail: string;
  variation: Variation;
}) {
  const colors = palettes[variation];
  return (
    <section
      aria-label={title}
      style={{
        width: 264,
        height: 128,
        padding: 22,
        borderRadius: 12,
        border: '1px solid ' + colors.border,
        background: colors.surface,
      }}
    >
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: 24,
          fontWeight: 400,
          color: colors.text,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.5,
          color: colors.muted,
        }}
      >
        {detail}
      </p>
    </section>
  );
}

/** Neutral tooling fixture, not a public studio composition contract. */
export function Composition({
  variation,
  target,
  imageUrl,
}: {
  variation: Variation;
  target: Target;
  imageUrl: string;
}) {
  const colors = palettes[variation];
  const delivery = (
    <NodePart
      title="Delivery"
      detail="A portable, inspectable result."
      variation={variation}
    />
  );
  if (target === 'delivery')
    return (
      <main
        className="fixture"
        aria-label="Delivery part"
        style={{ width: 264, height: 128, background: colors.canvas }}
      >
        {delivery}
      </main>
    );
  return (
    <main
      className="fixture"
      style={{
        width: 640,
        height: 360,
        padding: 40,
        background: colors.canvas,
        color: colors.text,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: colors.accent,
          fontSize: 13,
        }}
      >
        <img src={imageUrl} width={20} height={20} alt="Fixed blue circle" />
        <span>VISUAL WORKSPACE / QUALITY FIXTURE</span>
      </div>
      <h1
        style={{
          margin: '22px 0 8px',
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: '-1px',
        }}
      >
        From source to delivery
      </h1>
      <p style={{ margin: '0 0 26px', fontSize: 16, color: colors.muted }}>
        One composition. Two independently resolved variations.
      </p>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <NodePart
          title="Source"
          detail="Editable content and visual intent."
          variation={variation}
        />
        {delivery}
      </div>
    </main>
  );
}
