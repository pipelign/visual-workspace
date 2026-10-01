import type { Composition } from '../../../studio/index';

export const compose: Composition = ({ dimensions, tokens, assets }) => (
  <main
    style={{
      ...dimensions,
      padding: 40,
      background: tokens.canvas,
      color: tokens.text,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: tokens.workflowAccent,
        fontSize: 13,
      }}
    >
      <img src={assets.mark} width={20} height={20} alt="Fixed blue circle" />
      <span>VISUAL WORKSPACE / AUTHORING LOOP</span>
    </div>
    <h1
      style={{
        margin: '22px 0 8px',
        fontFamily: tokens.headingFont,
        fontSize: 32,
        fontWeight: 400,
        letterSpacing: '-1px',
      }}
    >
      From source to delivery
    </h1>
    <p style={{ margin: '0 0 26px', fontSize: 16, color: tokens.muted }}>
      One composition. Two independently resolved variations.
    </p>
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {[
        { title: 'Source', detail: 'Editable content and visual intent.' },
        { title: 'Delivery', detail: 'A portable, inspectable result.' },
      ].map(({ title, detail }) => (
        <section
          key={title}
          aria-label={title}
          style={{
            width: 264,
            height: 128,
            padding: 22,
            borderRadius: 12,
            border: '1px solid ' + tokens.border,
            background: tokens.surface,
          }}
        >
          <h2
            style={{
              margin: '0 0 12px',
              fontFamily: tokens.headingFont,
              fontSize: 24,
              fontWeight: 400,
              color: tokens.text,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              lineHeight: 1.5,
              color: tokens.muted,
            }}
          >
            {detail}
          </p>
        </section>
      ))}
    </div>
  </main>
);
