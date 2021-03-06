import {EMPTY_ARRAY} from '../constants';
import {snakeCase} from 'lodash';

export function findWithMatchingFields(collection, { fieldToMatch }, query='') {
  if (query.length < 2) {
    return EMPTY_ARRAY;
  }

  const searchRegexString = query.trim()
    .split(' ')
    // Only use terms longer than 1 char
    .filter(term => term.trim().length > 1)
    // Sanitize special chars
    .map(term => term.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'))
    // Search ahead when multiple terms provided
    .join('(\\S)*(\\s)+(.)*')

  const searchRegex = new RegExp(searchRegexString, 'i');

  const matches = [];
  for (let i = 0; i < collection.length; i++) {
    const obj = collection[i];
    if (searchRegex.test(obj[fieldToMatch])) {
      matches.push(obj);
    }
  }
  return matches;
}

export function toSnakeCase(object) {
  return Object.keys(object).reduce((acc, key) => {
    acc[snakeCase(key)] = object[key];
    return acc;
  }, {});
}
