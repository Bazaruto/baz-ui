const assert = require('assert');
const { createValidator, merge, isPresent } = require('../src/utils/validation-utils');

describe('form validation', () => {
  it('distinguishes missing values from zero and nonempty collections', () => {
    for (const value of [null, undefined, false, '', ' \n ', [], {}]) {
      assert.strictEqual(isPresent(value), false);
    }
    for (const value of [0, '0', 'name', ['name'], { name: 'value' }]) {
      assert.strictEqual(isPresent(value), true);
    }
  });

  it('reports the first failed rule without mutating form values', () => {
    const validate = createValidator({ validates: { amount: ['isPresent', 'isNumeric', 'isNotNegative'] } });
    assert.strictEqual(validate({ amount: '' }).messages.amount, 'This is required');
    assert.strictEqual(validate({ amount: 'unknown' }).messages.amount, 'This must be a number');
    assert.strictEqual(validate({ amount: '-1' }).messages.amount, 'This should be zero or more');
    const form = Object.freeze({ amount: '0', name: 'Example' });
    assert.deepStrictEqual(validate(form), { ...form, valid: true, messages: {} });
    assert.strictEqual(validate(form), validate(form));
  });

  it('binds custom rules to their definition and passes the complete form', () => {
    const validate = createValidator({
      validates: { confirmation: ['matchesPassword'] },
      mismatchMessage: 'Passwords must match',
      matchesPassword(value, form) {
        return value === form.password ? undefined : this.mismatchMessage;
      },
    });
    assert.strictEqual(validate({ password: 'example', confirmation: 'different' }).messages.confirmation, 'Passwords must match');
    assert.strictEqual(validate({ password: 'example', confirmation: 'example' }).valid, true);
  });

  it('composes rules without modifying their original definitions', () => {
    const first = { validates: { name: ['isPresent'] } };
    const second = { validates: { amount: ['isNumeric'] } };
    const combined = merge(first, second);
    assert.deepStrictEqual(combined.validates, { name: ['isPresent'], amount: ['isNumeric'] });
    assert.deepStrictEqual(first, { validates: { name: ['isPresent'] } });
    assert.deepStrictEqual(second, { validates: { amount: ['isNumeric'] } });
  });
});
