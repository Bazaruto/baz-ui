import _ from 'lodash';
import { isPresent } from './validation-rules';
import { createValidator } from './createValidator';
import type { Rules, Validated } from './createValidator';

export { createValidator, Rules, Validated };

export * from './validation-rules';
export const isBlank = (v: unknown) => !isPresent(v);

/**
 * Allows composition by merging multiple form definitions together
 */
export function merge(...defs: Rules[]) {
  return _.merge({}, ...defs);
}
