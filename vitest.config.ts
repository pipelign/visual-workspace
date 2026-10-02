import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'studio/**/*.test.ts',
      'studio/**/*.test.tsx',
      'tools/**/*.test.ts',
      'tools/**/*.test.tsx',
    ],
    allowOnly: false,
    coverage: {
      provider: 'v8',
      include: [
        'studio/catalog.ts',
        'studio/operations.tsx',
        'workspace/projects/source-to-delivery/figure.tsx',
        'tools/quality-lab/render.tsx',
        'tools/quality-lab/composition.tsx',
      ],
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: 'artifacts/coverage',
    },
  },
});
