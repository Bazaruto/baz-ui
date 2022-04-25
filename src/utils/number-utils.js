import {isNull, round} from 'lodash';

export function formatNumber(number, numberOfDecimals=2) {
  if (isNaN(number) || isNull(number)) {
    return '';
  }

  number = round(number, numberOfDecimals).toFixed(numberOfDecimals);
  const parts = number.split('.');
  const num = parts[0];
  const decimals = parts[1] ? '.' + parts[1] : '';
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + ',') + decimals;
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

