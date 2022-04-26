import * as rules from './validation-rules';
import GlobalMessages from './ValidationMessages';

export type FieldValidator = (val: any, form?: any) => string | void;

export function createFieldValidator(ruleContextObject: any, ruleName: string) {
  if (typeof ruleName !== 'string') {
    throw new TypeError('Rule name must be a String: ' + JSON.stringify(ruleName));
  }
  let validator = ruleContextObject[ruleName];
  if (validator) {
    validator = validator.bind(ruleContextObject);
    return validator;
  }
  // @ts-expect-error I don't see a way to add type information for "import * as rules"
  validator = rules[ruleName];
  if (!validator) {
    throw new TypeError('No associated validator was found for rule: ' + ruleName);
  }
  const message = GlobalMessages[ruleName];
  if (!message) {
    throw new TypeError('No associated message was found for global rule: ' + ruleName);
  }
  return function validateField(value: any, form: any) {
    return validator(value, form) ? undefined : message;
  }
}
