export type Variation = 'light' | 'dark';

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

/** Retained part-export probe until ticket 04; not a studio capability. */
export function Composition({ variation }: { variation: Variation }) {
  return (
    <main
      className="fixture"
      aria-label="Delivery part"
      style={{
        width: 264,
        height: 128,
        background: palettes[variation].canvas,
      }}
    >
      <NodePart
        title="Delivery"
        detail="A portable, inspectable result."
        variation={variation}
      />
    </main>
  );
}
