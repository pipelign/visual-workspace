import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './shell.css';

function Lab() {
  const [showDark, setShowDark] = useState(true);
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <header className="mb-6 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-600">
          Development foundation
        </p>
        <h1 className="my-3 text-3xl font-semibold">Rendering quality lab</h1>
        <p className="mb-5 text-slate-700">
          A neutral fixture for inspecting the toolchain, isolated previews, and
          portable exports.
        </p>
        <button
          type="button"
          aria-pressed={showDark}
          onClick={() => {
            setShowDark(!showDark);
          }}
          className="rounded-md bg-slate-900 px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          {showDark ? 'Hide dark variation' : 'Show dark variation'}
        </button>
      </header>
      <div className="flex flex-wrap gap-6">
        <section aria-label="Light variation">
          <h2 className="mb-2 text-lg font-semibold">Light</h2>
          <iframe
            title="Light figure"
            src="./fixtures/light.html"
            width="640"
            height="360"
            className="max-w-full rounded-xl border border-slate-300"
          />
          <a
            className="mt-2 inline-block underline"
            href="./fixtures/light.html"
            download
          >
            Download light HTML
          </a>
        </section>
        {showDark && (
          <section aria-label="Dark variation">
            <h2 className="mb-2 text-lg font-semibold">Dark</h2>
            <iframe
              title="Dark figure"
              src="./fixtures/dark.html"
              width="640"
              height="360"
              className="max-w-full rounded-xl border border-slate-300"
            />
            <a
              className="mt-2 inline-block underline"
              href="./fixtures/dark.html"
              download
            >
              Download dark HTML
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
const root = document.getElementById('root');
if (!root) throw new Error('Development lab root is missing');
createRoot(root).render(<Lab />);
