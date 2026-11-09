const babelRegister = require('@babel/register');
module.exports = babelRegister({ extensions: ['.ts', '.tsx', '.js'] });
