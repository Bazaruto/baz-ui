import { isEmpty } from 'lodash';
import { createFieldValidator } from './createFieldValidator'

/**
 * Creates a function that validates according to the provided form rules
 */
export function createValidator(def) {
  let prevForm;
  let prevResult;

  let _validators;
  let _validatables;
  function createFieldValidatorCache() {
    _validators = {};
    _validatables = Object.keys(def.validates);
    // Create and cache validators from rules
    _validatables.forEach(field => {
      _validators[field] = def.validates[field].map(rule => createFieldValidator(def, rule));
    });
  }

  /**
   * Returns the first message it finds by running through the provided field's validators.
   * Returns nothing if all validations pass
   */
  function getMessage(field, form) {
    const validators = _validators[field];
    for (let i = 0; i < validators.length; i++) {
      const validate = validators[i];
      const message = validate(form[field], form);
      if (message) {
        return message;
      }
    }
  }

  /**
   * Returns all validation messages for the provided form
   */
  function getMessages(form) {
    const messages = {};
    for (let i = 0; i < _validatables.length; i++) {
      const field = _validatables[i];
      const message = getMessage(field, form);

      if (message) {
        messages[field] = message;
      }
    }
    return messages;
  }

  /**
   * Returns the result of validating the provided form. The result
   * consists of the form as is, messages by field name, and a valid flag
   */
  return function validate(form = {}) {
    if (form === prevForm) {
      return prevResult;
    }

    // Creation of cache is deferred
    if (!_validators) {
      createFieldValidatorCache();
    }

    const messages = getMessages(form);
    const result = {
      ...form,
      messages,
      valid: isEmpty(messages),
    };

    prevForm = form;
    prevResult = result;
    return result;
  }
}
