import * as ValidationRules from './validation-rules';
import GlobalMessages from './ValidationMessages';

/**
 * @param ruleContextObject The object that declares the custom validation rules
 * @param ruleName String
 * @returns A function that accepts the field value and form as arguments, and returns a message when invalid,
 * nothing when valid
 */
export function createFieldValidator(ruleContextObject, ruleName) {
  if (typeof ruleName !== 'string') {
    throw new TypeError('Rule name must be a String: ' + JSON.stringify(ruleName));
  }
  let validator = ruleContextObject[ruleName];
  if (validator) {
    validator = validator.bind(ruleContextObject);
    return validator;
  }

  validator = ValidationRules[ruleName];
  if (!validator) {
    throw new TypeError('No associated validator was found for rule: ' + ruleName);
  }
  const message = GlobalMessages[ruleName];
  if (!message) {
    throw new TypeError('No associated message was found for global rule: ' + ruleName);
  }
  return function validateField(value, form) {
    return validator(value, form) ? undefined : message;
  }
}
