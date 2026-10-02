import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { Composition } from './composition';
import type { Variation } from './composition';

const defaultFont = new URL(
  import.meta.resolve('@fontsource/inter/files/inter-latin-400-normal.woff2'),
);
const license = new URL(import.meta.resolve('@fontsource/inter/LICENSE'));

export async function renderFixture({
  variation,
  fontPath = defaultFont,
}: {
  variation: Variation;
  fontPath?: URL;
}) {
  let font: Buffer;
  try {
    font = await readFile(fontPath);
    if (font.subarray(0, 4).toString() !== 'wOF2')
      throw new Error('Expected a WOFF2 font');
  } catch (cause) {
    throw new Error(
      'Cannot load required fixture font: ' + fileURLToPath(fontPath),
      { cause },
    );
  }
  const dimensions = { width: 264, height: 128 };
  const fontLicense = await readFile(license, 'utf8');
  const fontUrl = 'data:font/woff2;base64,' + font.toString('base64');
  const markup = renderToStaticMarkup(<Composition variation={variation} />);
  const styles = `
    @font-face { font-family: 'Fixture Inter'; src: url('${fontUrl}') format('woff2'); font-weight: 400; font-style: normal; font-display: block; }
    @page { size: ${String(dimensions.width)}px ${String(dimensions.height)}px; margin: 0; }
    html, body { margin: 0; padding: 0; }
    .fixture { font-family: 'Fixture Inter', sans-serif; }
    .fixture, .fixture * { box-sizing: border-box; }
    * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  `;
  const html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rendering quality fixture</title><style>' +
    styles +
    '</style></head><body>' +
    markup +
    '</body></html>\n<!-- Inter font license:\n' +
    fontLicense.replaceAll('--', '—') +
    '\n-->\n';
  return { html, dimensions };
}
