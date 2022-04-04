import { merge as lodashMerge } from 'lodash';
import { isPresent } from './validation-rules';

export { createValidator } from './createValidator';

export * from './validation-rules';
export const isBlank = v => !isPresent(v);

/**
 * Allows composition by merging multiple form definitions together
 */
export function merge(...defs) {
  return lodashMerge({}, ...defs);
}
