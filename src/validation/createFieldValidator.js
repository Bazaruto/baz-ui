import _ from 'lodash';
import * as rules from './validation-rules';
import GlobalMessages from './ValidationMessages';

/**
 * @param ruleContextObject The object that the rule was declared within, which has access to custom validator functions
 * @param rule String | Object
 * @returns A function that accepts the field value and form as arguments, and returns a message when invalid,
 * nothing when valid
 */
export function createFieldValidator(ruleContextObject, rule) {
  const isStringRule = _.isString(rule);
  let validatorName, message;
  if (isStringRule) {
    validatorName = rule;
    message = GlobalMessages[rule]; // If it's not a custom rule, then we will find a message here
  } else if (_.isObject(rule)){
    validatorName = rule.validator;
    message = rule.message;
  } else {
    throw new TypeError('Field validator was neither a String | Object: ' + JSON.stringify(rule));
  }

  let validator = ruleContextObject[validatorName];
  const isCustomRule = !!validator;
  if (isCustomRule) {
    if (validator.createMemoizedFieldValidator) {
      const memoized = validator.createMemoizedFieldValidator();
      validator = (_value, form) => memoized(form);
    } else {
      validator = validator.bind(ruleContextObject);
    }
  } else {
    validator = rules[validatorName];
  }

  if (isStringRule && isCustomRule) {
    // These are full validators that returns a message when invalid, so we use them as is
    return validator;
  }

  if (!message) {
    throw new TypeError('No associated message was found for field validator: ' + JSON.stringify(rule));
  }

  return function validateField(value, form) {
    // These are primitive validators that return true or false, so we need to make them whole by returning the
    // associated message when invalid, and nothing when valid
    return validator(value, form) ? undefined : message;
  }
}
