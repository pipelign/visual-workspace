import { resolve } from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { StudioError } from './contracts.ts';
import type * as PublicOperations from './index.ts';

function isOperations(value: unknown): value is typeof PublicOperations {
  return (
    !!value &&
    typeof value === 'object' &&
    'discover' in value &&
    typeof value.discover === 'function' &&
    'inspect' in value &&
    typeof value.inspect === 'function' &&
    'render' in value &&
    typeof value.render === 'function' &&
    'createHtmlExport' in value &&
    typeof value.createHtmlExport === 'function'
  );
}
function install(server: ViteDevServer): void {
  server.middlewares.use('/api', (request, response, next) => {
    if (request.method !== 'GET') {
      response.statusCode = 405;
      response.end('Method not allowed');
      return;
    }
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (
      !['/artifacts', '/inspect', '/render', '/export'].includes(url.pathname)
    ) {
      next();
      return;
    }
    async function handle() {
      try {
        const module: unknown = await server.ssrLoadModule(
          resolve('studio/index.ts'),
        );
        if (!isOperations(module))
          throw new Error('Studio operations failed to load.');
        const root = resolve('workspace');
        const id = url.searchParams.get('id') ?? '';
        const variation = url.searchParams.get('variation') ?? '';
        const environment = {
          loadModule: async (path: string): Promise<unknown> =>
            server.ssrLoadModule(path),
        };
        let result: unknown;
        switch (url.pathname) {
          case '/artifacts':
            result = await module.discover(root);
            break;
          case '/inspect':
            result = await module.inspect(root, id);
            break;
          case '/export': {
            const format = url.searchParams.get('format');
            result = await module.createHtmlExport(
              root,
              { id, variation, format: format ?? '' },
              environment,
            );
            break;
          }
          default:
            result = await module.render(root, { id, variation }, environment);
        }
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-store');
        response.end(JSON.stringify(result));
      } catch (cause) {
        response.statusCode = 422;
        response.setHeader('Content-Type', 'application/json');
        // SSR can instantiate its own StudioError class; use the diagnostic shape.
        const diagnostic =
          cause instanceof StudioError ||
          (cause && typeof cause === 'object' && 'diagnostic' in cause)
            ? cause.diagnostic
            : undefined;
        response.end(
          JSON.stringify({
            diagnostic,
            message:
              cause instanceof Error
                ? cause.message
                : 'Studio operation failed.',
          }),
        );
      }
    }
    void handle();
  });
}
export function studioApi(): Plugin {
  return {
    name: 'studio-api',
    configureServer(server) {
      server.watcher.add(resolve('workspace'));
      server.watcher.on('all', (_event, path) => {
        if (path.includes('/workspace/') || path.includes('\\workspace\\'))
          server.ws.send({ type: 'custom', event: 'workspace-changed' });
      });
      install(server);
    },
    async configurePreviewServer(server) {
      // The built UI uses the same real operations, with Vite's TSX-aware loader.
      // This internal loader has no listening port and is closed with preview.
      const { createServer } = await import('vite');
      const loader = await createServer({
        configFile: false,
        root: resolve('.'),
        plugins: [(await import('@vitejs/plugin-react')).default()],
        server: { middlewareMode: true },
        appType: 'custom',
      });
      server.httpServer.on('close', () => {
        void loader.close();
      });
      server.middlewares.use(loader.middlewares);
      install(loader);
    },
  };
}
