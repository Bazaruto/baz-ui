import _ from 'lodash';
import { isPresent } from './validation-rules';
import { createValidator } from './createValidator';
import type { Rules, Validated } from './createValidator';

export { createValidator, Rules, Validated };

export * from './validation-rules';
export const isBlank = (v: unknown) => !isPresent(v);

/**
 * Allows composition by merging multiple rules together
 */
export function merge<Ob1, Ob2>(a: Ob1, b: Ob2): Ob1 & Ob2;
export function merge<Ob1, Ob2, Ob3>(a: Ob1, b: Ob2, c: Ob3): Ob1 & Ob2 & Ob3;
export function merge(...args: any[]) {
  return _.merge({}, ...args);
}
