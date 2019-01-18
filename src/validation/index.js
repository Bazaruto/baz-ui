import _ from 'lodash';
import { createSelector } from 'reselect';

export { createValidator } from './createValidator';

export * from './validation-rules';

/**
 * Allows composition by merging multiple form definitions together
 */
export function merge(...defs) {
  return _.merge({}, ...defs);
}

export function memoize(...args) {
  return {
    createMemoizedFieldValidator() {
      return createSelector(...args);
    }
  };
}
