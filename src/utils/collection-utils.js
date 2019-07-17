import {EMPTY_ARRAY} from '../constants';
import _ from 'lodash';

export function findWithMatchingFields(collection, { getStringToMatch, fieldToMatch }, query='') {
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
    if (searchRegex.test(getStringToMatch ? getStringToMatch(obj) : obj[fieldToMatch])) {
      matches.push(obj);
    }
  }
  return matches;
}

export function toSnakeCase(object) {
  return Object.keys(object).reduce((acc, key) => {
    acc[_.snakeCase(key)] = object[key];
    return acc;
  }, {});
}
