const assert = require('assert');
const { formatDate, formatDateTime, _ensureDay } = require('../src/utils/date-utils');

describe('date formatting', () => {
  it('formats offset dates in UTC for storage', () => {
    assert.strictEqual(formatDate('2026-11-09T00:30:00+02:00'), '2026-11-08');
    assert.strictEqual(formatDateTime('2026-11-09T00:30:00+02:00'), '2026-11-08 22:30');
  });

  it('supports custom display formats and leap days', () => {
    assert.strictEqual(formatDate('2024-02-29', 'DD/MM/YYYY'), '29/02/2024');
  });

  it('preserves an existing day value and its UTC interpretation', () => {
    const day = _ensureDay('2026-11-09T12:45:00Z');
    assert.strictEqual(_ensureDay(day), day);
    assert.strictEqual(formatDateTime(day), '2026-11-09 12:45');
  });

  it('keeps invalid values visibly invalid', () => {
    assert.strictEqual(formatDate('not-a-date'), 'Invalid Date');
  });
});
