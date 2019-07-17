module.exports = function(api) {
  checkEnv(api);
  var isDevelopmentEnv = api.env('development')
  var isProductionEnv = api.env('production')
  var isTestEnv = api.env('test')

  const presets = [
    [
      require('@babel/preset-env').default,
      {
        targets: {
          node: 'current'
        }
      }
    ],
  ]

  const plugins = [
    require('@babel/plugin-transform-destructuring').default,
    [
      require('@babel/plugin-proposal-class-properties').default, { loose: true }
    ],
    [
      require('@babel/plugin-proposal-object-rest-spread').default, { useBuiltIns: true }
    ],
  ];

  return {
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
