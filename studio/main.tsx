import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';

interface Item {
  id: string;
  title: string;
  description: string;
}
interface Details {
  item: Item;
  width: number;
  height: number;
  variations: string[];
  diagnostics: string[];
}
type Preview =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'ready'; html: string };
function object(value: unknown): Record<string, unknown> {
  if (!isObject(value)) throw new Error('Invalid studio response.');
  return value;
}
function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function string(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Invalid studio response.');
  return value;
}
function item(value: unknown): Item {
  const data = object(value);
  return {
    id: string(data.id),
    title: string(data.title),
    description: string(data.description),
  };
}
async function api(path: string): Promise<unknown> {
  const response = await fetch('/api/' + path);
  const data: unknown = await response.json();
  if (!response.ok) {
    const result = object(data);
    const diagnostic = result.diagnostic
      ? object(result.diagnostic)
      : undefined;
    throw new Error(
      diagnostic
        ? string(diagnostic.message) + ' ' + string(diagnostic.repair)
        : string(result.message),
    );
  }
  return data;
}
function query(id: string, variation?: string): string {
  return new URLSearchParams({
    id,
    ...(variation ? { variation } : {}),
  }).toString();
}

function PreviewCard({
  details,
  variation,
  revision,
}: {
  details: Details;
  variation: string;
  revision: number;
}) {
  const [preview, setPreview] = useState<Preview>({ status: 'loading' });
  const [delivery, setDelivery] = useState<
    | { status: 'idle' }
    | { status: 'preparing' }
    | { status: 'delivered' }
    | { status: 'failed'; message: string }
  >({ status: 'idle' });
  useEffect(() => {
    let active = true;
    void api('render?' + query(details.item.id, variation))
      .then((value) => {
        const html = string(object(value).html);
        if (active) setPreview({ status: 'ready', html });
      })
      .catch((cause: unknown) => {
        if (active)
          setPreview({
            status: 'failed',
            message: cause instanceof Error ? cause.message : 'Preview failed.',
          });
      });
    return () => {
      active = false;
    };
  }, [details.item.id, variation, revision]);
  async function download() {
    setDelivery({ status: 'preparing' });
    try {
      const result = object(
        await api(
          'export?' + query(details.item.id, variation) + '&format=html',
        ),
      );
      const url = URL.createObjectURL(
        new Blob([string(result.html)], { type: 'text/html' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = details.item.id + '-' + variation + '.html';
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      setDelivery({ status: 'delivered' });
    } catch (cause) {
      setDelivery({
        status: 'failed',
        message: cause instanceof Error ? cause.message : 'Export failed.',
      });
    }
  }
  return (
    <section aria-label={variation + ' variation'} className="preview-card">
      <h3>{variation}</h3>
      {preview.status === 'loading' && (
        <p role="status">Rendering saved source…</p>
      )}
      {preview.status === 'failed' && (
        <p role="alert">Incomplete preview. {preview.message}</p>
      )}
      {preview.status === 'ready' && (
        <div className="preview-scroll">
          <iframe
            sandbox="allow-same-origin"
            title={variation + ' figure'}
            srcDoc={preview.html}
            width={details.width}
            height={details.height}
          />
        </div>
      )}
      <button
        type="button"
        disabled={preview.status !== 'ready' || delivery.status === 'preparing'}
        onClick={() => {
          void download();
        }}
      >
        Download {variation} HTML
      </button>
      <p role={delivery.status === 'failed' ? 'alert' : 'status'}>
        {delivery.status === 'preparing'
          ? 'Preparing HTML…'
          : delivery.status === 'delivered'
            ? 'HTML delivered with its source record.'
            : delivery.status === 'failed'
              ? delivery.message
              : ''}
      </p>
    </section>
  );
}
function ArtifactDetails({
  id,
  compare,
  revision,
}: {
  id: string;
  compare: boolean;
  revision: number;
}) {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'failed'; message: string }
    | { status: 'ready'; details: Details }
  >({ status: 'loading' });
  useEffect(() => {
    let active = true;
    void api('inspect?' + query(id))
      .then((value) => {
        const data = object(value);
        const dimensions = object(data.dimensions);
        if (
          typeof dimensions.width !== 'number' ||
          typeof dimensions.height !== 'number' ||
          !Array.isArray(data.variations) ||
          !Array.isArray(data.diagnostics)
        )
          throw new Error('Invalid inspection response.');
        const details: Details = {
          item: item(data),
          width: dimensions.width,
          height: dimensions.height,
          variations: data.variations.map((entry: unknown) => string(entry)),
          diagnostics: data.diagnostics.map((entry: unknown) => {
            const diagnostic = object(entry);
            return string(diagnostic.message) + ' ' + string(diagnostic.repair);
          }),
        };
        if (active) setState({ status: 'ready', details });
      })
      .catch((cause: unknown) => {
        if (active)
          setState({
            status: 'failed',
            message:
              cause instanceof Error ? cause.message : 'Inspection failed.',
          });
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (state.status === 'loading') return <p role="status">Inspecting draft…</p>;
  if (state.status === 'failed') return <p role="alert">{state.message}</p>;
  const { details } = state;
  return (
    <>
      <h2>{details.item.title}</h2>
      <p>{details.item.description}</p>
      <p className="metadata">
        Draft · {details.width} × {details.height} px · HTML · ID:{' '}
        {details.item.id}
      </p>
      {details.diagnostics.map((message) => (
        <p role="alert" key={message}>
          {message}
        </p>
      ))}
      <div className="previews">
        {details.variations
          .slice(0, compare ? undefined : 1)
          .map((variation) => (
            <PreviewCard
              key={variation}
              details={details}
              variation={variation}
              revision={revision}
            />
          ))}
      </div>
    </>
  );
}
function Studio() {
  const [catalog, setCatalog] = useState<
    | { status: 'loading' }
    | { status: 'failed'; message: string }
    | { status: 'ready'; items: Item[] }
  >({ status: 'loading' });
  const [selected, setSelected] = useState('');
  const [revision, setRevision] = useState(0);
  const [compare, setCompare] = useState(true);
  useEffect(() => {
    if (!import.meta.hot) return;
    const refresh = () => {
      setRevision((value) => value + 1);
    };
    import.meta.hot.on('workspace-changed', refresh);
    return () => {
      import.meta.hot?.off('workspace-changed', refresh);
    };
  }, []);
  useEffect(() => {
    let active = true;
    void api('artifacts')
      .then((value) => {
        if (!Array.isArray(value)) throw new Error('Invalid catalog response.');
        const items = value.map((entry: unknown) => item(entry));
        if (active) setCatalog({ status: 'ready', items });
      })
      .catch((cause: unknown) => {
        if (active)
          setCatalog({
            status: 'failed',
            message:
              cause instanceof Error ? cause.message : 'Discovery failed.',
          });
      });
    return () => {
      active = false;
    };
  }, [revision]);
  const items = catalog.status === 'ready' ? catalog.items : [];
  const current = items.some((entry) => entry.id === selected)
    ? selected
    : (items[0]?.id ?? '');
  return (
    <main className="studio">
      <header>
        <p className="eyebrow">Visual workspace</p>
        <h1>Your visual studio</h1>
        <p>
          Find a draft, compare its brand variations, and deliver a portable
          HTML snapshot.
        </p>
      </header>
      <div className="toolbar">
        <div className="field">
          <label htmlFor="figure">Figure</label>
          <select
            id="figure"
            value={current}
            onChange={(event) => {
              setSelected(event.target.value);
            }}
          >
            {items.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setRevision((value) => value + 1);
          }}
        >
          Refresh saved source
        </button>
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => {
            setCompare(!compare);
          }}
        >
          {compare ? 'Hide comparison' : 'Compare variations'}
        </button>
      </div>
      {catalog.status === 'loading' && <p role="status">Loading workspace…</p>}
      {catalog.status === 'failed' && <p role="alert">{catalog.message}</p>}
      {catalog.status === 'ready' && !items.length && (
        <p>No figures yet. Add a draft through the workspace catalog.</p>
      )}
      {catalog.status === 'ready' && current && (
        <ArtifactDetails
          key={current + '-' + String(revision)}
          id={current}
          compare={compare}
          revision={revision}
        />
      )}
    </main>
  );
}
const root = document.getElementById('root');
if (!root) throw new Error('Studio root is missing.');
createRoot(root).render(<Studio />);
