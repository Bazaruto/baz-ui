import _ from 'lodash';

export function formatNumber(number, numberOfDecimals=2) {
  if (isNaN(number) || _.isNull(number)) {
    return '';
  }

  number = _.round(number, numberOfDecimals).toFixed(numberOfDecimals);
  const parts = number.split('.');
  const num = parts[0];
  const decimals = parts[1] ? '.' + parts[1] : '';
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + ',') + decimals;
}

export function formatCurrency(currencySymbol, amount) {
  amount = parseFloat(amount);
  if (isNaN(amount)) {
    return undefined;
  }
  if (amount < 0) {
    return `${currencySymbol}(${formatNumber(Math.abs(amount), 2)})`;
  }
  return `${currencySymbol}${formatNumber(amount, 2)}`;
}

export function formatCurrencyWithCode(amount, code) {
  amount = parseFloat(amount);
  if (isNaN(amount)) {
    return undefined;
  }
  const codeSuffix = code ? ` ${code}` : '';
  if (amount < 0) {
    return `(${formatNumber(Math.abs(amount), 2)})${codeSuffix}`;
  }
  return `${formatNumber(amount, 2)}${codeSuffix}`;
}

export function breakIntoAmounts(currencyString) {
  const splitted = currencyString.split('.');

  let integerAmount = splitted[0];
  integerAmount = integerAmount.replace(/\D/g, '');

  const leftovers = splitted.slice(1)
  let decimalAmount = leftovers.reduce((res, s) => `${res}${s}`, '');
  decimalAmount = decimalAmount.replace(/\D/g, '');

  return [integerAmount, decimalAmount];
}

