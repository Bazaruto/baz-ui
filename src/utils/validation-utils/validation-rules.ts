import _ from 'lodash';

export function isPresent(value: unknown) {
  if (typeof value === 'string') {
    // lodash isEmpty does not catch blank space or new line characters
    return /\S/.test(value);
  }
  if (_.isObject(value)) {
    return !_.isEmpty(value);
  }
  return !!value || value === 0;
}

export function isNotZero(value: number | string) {
  return value !== 0 && value !== '0';
}

export function isGreaterThanZero(value: number | string) {
  return +value > 0;
}

export function isNotNegative(value: number | string) {
  return +value >= 0;
}

export function isEmail(value: string) {
  return matchRegexp(
    value,
    // eslint-disable-next-line no-useless-escape, no-control-regex
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  );
}

export function isUrl(value: string) {
  return matchRegexp(
    value,
    // eslint-disable-next-line no-useless-escape
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  );
}

export function isNumeric(value: string | number) {
  if (typeof value === 'number') {
    return true;
  }
  return matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
}

export function isAlpha(value: string) {
  return matchRegexp(value, /^[A-Z]+$/i);
}

export function isAlphaAllowSpaces(value: string) {
  return matchRegexp(value, /^[A-Za-zÀ-ÿ\s]+$/i);
}

export function isAlphanumeric(value: string) {
  return matchRegexp(value, /^[0-9A-Z]+$/i);
}

function matchRegexp(value: string, regexp: RegExp) {
  return !isPresent(value) || regexp.test(value);
}
