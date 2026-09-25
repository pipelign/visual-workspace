import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tools/**/*.test.ts', 'tools/**/*.test.tsx'],
    allowOnly: false,
    coverage: {
      provider: 'v8',
      include: [
        'tools/quality-lab/render.tsx',
        'tools/quality-lab/composition.tsx',
      ],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'artifacts/coverage',
    },
  },
});
