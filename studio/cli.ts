import { resolve } from 'node:path';
import {
  discover,
  inspect,
  render,
  exportArtifact,
  StudioError,
} from './index';

const [command, id = '', variation = 'light', output = 'artifacts/exports'] =
  process.argv.slice(2);
const root = resolve(process.env.STUDIO_WORKSPACE ?? 'workspace');
try {
  switch (command ?? '') {
    case 'list':
      console.log(JSON.stringify(await discover(root), null, 2));
      break;
    case 'inspect':
      console.log(JSON.stringify(await inspect(root, id), null, 2));
      break;
    case 'render':
      console.log((await render(root, { id, variation })).html);
      break;
    case 'export':
      console.log(
        JSON.stringify(
          await exportArtifact(root, { id, variation, format: 'html', output }),
          null,
          2,
        ),
      );
      break;
    default:
      throw new Error(
        'Usage: npm run studio -- list | inspect ID | render ID VARIATION | export ID VARIATION OUTPUT',
      );
  }
} catch (cause) {
  console.error(
    cause instanceof StudioError
      ? JSON.stringify(cause.diagnostic, null, 2)
      : cause,
  );
  process.exitCode = 1;
}
