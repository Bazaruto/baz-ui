import _ from 'lodash';
import * as rules from './validation-rules';
import ValidationMessages from './ValidationMessages';

export function createFieldValidator(context, rule) {
  let validatorName;
  let message;

  if (_.isString(rule)) {
    validatorName = rule;
    message = ValidationMessages[rule] || 'This is required';
  } else if (_.isObject(rule)){
    validatorName = rule.validator;
    message = rule.message;
  } else {
    throw 'Unknown field validator format';
  }

  let validator = context[validatorName];
  if (validator) {
    if (validator.createMemoizedFieldValidator) {
      const memoized = validator.createMemoizedFieldValidator();
      validator = (_value, form) => memoized(form);
    } else {
      validator = validator.bind(context);
    }
  } else {
    validator = rules[validatorName];
  }

  return function validateField(value, form) {
    return validator(value, form) ? undefined : message;
  }
}
