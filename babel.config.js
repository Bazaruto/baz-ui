module.exports = function(api) {
  checkEnv(api);

  const presets = [
    [
      require('@babel/preset-env').default,
      {
        bugfixes: true,
      }
    ],
    [require('@babel/preset-react').default, { runtime: 'classic' }],
    [require('@babel/preset-typescript').default, { allowDeclareFields: true }],
  ]

  const plugins = [
    require('@babel/plugin-transform-destructuring').default,
    require('@babel/plugin-transform-class-properties').default,
    [
      require('@babel/plugin-transform-object-rest-spread').default, { useBuiltIns: true }
    ],
  ];

  return {
    targets: { node: 'current' },
    assumptions: { setPublicClassFields: true },
    presets,
    plugins,
  };
}

function checkEnv(api) {
  var currentEnv = api.env()
  var validEnv = ['development', 'test', 'production']

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(currentEnv) +
      '.'
    )
  }
}
