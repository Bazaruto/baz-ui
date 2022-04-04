const config = {
  require: ['test/babel-register'],
  ui: 'bdd',
  reporter: 'spec',
  recursive: true,
  timeout: 5000,
  extension: ['js', 'ts', 'tsx'],
  spec: ['src/**/*-test.+(js|ts|tsx)', 'test/**/*-test.+(js|ts|tsx)'],
};

module.exports = config;
