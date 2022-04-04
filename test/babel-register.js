const babelRegister = require('@babel/register');
module.exports = babelRegister({ ignore: [], extensions: ['.ts', '.tsx', '.js'] });
