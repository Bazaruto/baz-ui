import {getUrlSearchParams} from '../src/utils/dom-utils';
import assert from 'assert';

const enc = encodeURIComponent;

describe('getUrlSearchParams', () => {
  it('returns empty object when no url params are present', () => {
    assert.deepEqual(getUrlSearchParams(`http://x.za/search`), {})
  })

  it('decodes bracket arrays', () => {
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?${enc('a[]')}=tommy&b=42&${enc('a[]')}=shelby`),
      {
        a: ['tommy', 'shelby'],
        b: '42'
      }
    )
  })

  it('decodes indexed arrays', () => {
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?${enc('a[0]')}=tommy&b=42&${enc('a[1]')}=shelby`),
      {
        a: ['tommy', 'shelby'],
        b: '42'
      }
    )
  })

  it('decodes out of order indexed arrays', () => {
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?${enc('a[1]')}=shelby&b=42&${enc('a[0]')}=tommy`),
      {
        a: ['tommy', 'shelby'],
        b: '42'
      }
    )
  })

  it('decodes repeating params as arrays', () => {
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?a=tommy&b=42&a=shelby`),
      {
        a: ['tommy', 'shelby'],
        b: '42'
      }
    )
  })

  it('coerces true and false to booleans', () => {
    assert.deepEqual(
      getUrlSearchParams('http://x.za/search?a=true&b=false&c=foo'),
      { a: true, b: false, c: 'foo' }
    )
    const expected = {
      a: [true, false, 'foo']
    }
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?${enc('a[]')}=true&${enc('a[]')}=false&${enc('a[]')}=foo`),
      expected
    )
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?${enc('a[0]')}=true&${enc('a[1]')}=false&${enc('a[2]')}=foo`),
      expected
    )
    assert.deepEqual(
      getUrlSearchParams(`http://x.za/search?a=true&a=false&a=foo`),
      expected
    )
  })
})
