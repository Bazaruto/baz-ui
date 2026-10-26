const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {createRequire} = require('module');
const babel = require('@babel/core');

// Exercise the parser Babel actually resolves, including if it becomes nested.
const babelRequire = createRequire(require.resolve('@babel/core/package.json'));
const JSON5 = babelRequire('json5');

describe('Babel JSON5 dependency', () => {
  it('keeps __proto__ as an own property without changing parsed object prototypes', () => {
    const parsed = JSON5.parse(`{
      __proto__: {isAdmin: true},
      nested: {__proto__: null},
    }`);

    for (const object of [parsed, parsed.nested]) {
      assert.strictEqual(Object.getPrototypeOf(object), Object.prototype);
      assert.strictEqual(object.isAdmin, undefined);
      assert.ok(Object.keys(object).includes('__proto__'));
    }
    assert.deepStrictEqual(parsed.__proto__, {isAdmin: true});
    assert.strictEqual(parsed.nested.__proto__, null);
  });

  it('preserves JSON5 syntax, stringify round trips, and revivers', () => {
    const parsed = JSON5.parse(`{
      // Babel configuration files allow comments and trailing commas.
      label: 'sample',
      values: [0x10, +2, .5,],
    }`, (key, value) => key === 'label' ? value.toUpperCase() : value);

    assert.deepStrictEqual(parsed, {label: 'SAMPLE', values: [16, 2, 0.5]});
    assert.deepStrictEqual(JSON5.parse(JSON5.stringify(parsed)), parsed);
  });

  it('rejects malformed configuration input', () => {
    assert.throws(() => JSON5.parse('{unclosed: [1, 2}'), SyntaxError);
  });

  it('loads a JSON5 configuration through Babel and transforms JavaScript', () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'baz-ui-json5-'));
    try {
      const configFile = path.join(directory, 'babel.config.json');
      fs.writeFileSync(configFile, `{
        // JSON5 configuration, consumed by Babel rather than parsed directly.
        comments: false,
        compact: true,
      }`);
      const result = babel.transformSync('// removed comment\nconst answer = 42;', {
        configFile,
        babelrc: false,
      });

      assert.strictEqual(result.code, 'const answer=42;');
    } finally {
      fs.rmSync(directory, {recursive: true, force: true});
    }
  });
});
