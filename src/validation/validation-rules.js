/* eslint-disable no-useless-escape */
import {isObject, isEmpty} from 'lodash';

export function isPresent(value) {
  if (typeof value === 'string') {
    // lodash isEmpty does not catch blank space or new line characters
    return (/\S/.test(value));
  }
  if (isObject(value)) {
    return !isEmpty(value);
  }
  return !!value || value === 0;
}

export function isRequired(value) {
  return !!value || value === 0;
}

export function isNotEmpty(value) {
  return !isEmpty(value);
}

export function isNotZero(value) {
  return value !== 0 && value !== '0';
}

export function isGreaterThanZero(value) {
  return value > 0;
}

export function isNotNegative(value) {
  return value >= 0;
}

export function isEmail(value) {
  // eslint-disable-next-line no-control-regex
  return matchRegexp(value, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
}

export function isUrl(value) {
  return matchRegexp(value, /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
}

export function isNumeric(value) {
  if (typeof value === 'number') {
    return true;
  }
  return matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
}

export function isAlpha(value) {
  return matchRegexp(value, /^[A-Z]+$/i);
}

export function isAlphaAllowSpaces(value) {
  return matchRegexp(value, /^[A-Za-zÀ-ÿ\s]+$/i);
}

export function isAlphanumeric(value) {
  return matchRegexp(value, /^[0-9A-Z]+$/i);
}

function matchRegexp(value, regexp) {
  return !isPresent(value) || regexp.test(value);
}
