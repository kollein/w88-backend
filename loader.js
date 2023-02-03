// https://github.com/TypeStrong/ts-node/discussions/1450

import {
  resolve as resolveTs,
  getFormat,
  transformSource,
} from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';

export { getFormat, transformSource };

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)

export function resolve(specifier, context, defaultResolver) {
  const mappedSpecifier = matchPath(specifier)
  if (mappedSpecifier) {
    specifier = `${mappedSpecifier}.ts`
  }
  return resolveTs(specifier, context, defaultResolver);
}