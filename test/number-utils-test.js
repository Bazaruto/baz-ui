const assert = require('assert');
const { formatNumber, breakIntoAmounts } = require('../src/utils/number-utils');

describe('currency formatting', () => {
  it('rounds decimal amounts before adding grouping separators', () => {
    assert.strictEqual(formatNumber(1234.565), '1,234.57');
    assert.strictEqual(formatNumber(-1234.5), '-1,234.50');
    assert.strictEqual(formatNumber(1234.5, 0), '1,235');
  });

  it('preserves zero and renders missing or invalid amounts as blank', () => {
    assert.strictEqual(formatNumber(0), '0.00');
    assert.strictEqual(formatNumber(null), '');
    assert.strictEqual(formatNumber('invalid'), '');
  });

  it('extracts editable amounts from a formatted currency input', () => {
    assert.deepStrictEqual(breakIntoAmounts('R 1,234.5.6'), ['1234', '56']);
    assert.deepStrictEqual(breakIntoAmounts(''), ['', '']);
  });
});
