import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { studioApi } from './studio/server.ts';

export default defineConfig({
  root: fileURLToPath(new URL('./studio', import.meta.url)),
  base: './',
  publicDir: 'public',
  plugins: [react(), tailwindcss(), studioApi()],
  build: { outDir: '../dist/studio', emptyOutDir: true },
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    watch: { awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 20 } },
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
