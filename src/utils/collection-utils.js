import {EMPTY_ARRAY} from '../constants';

export function findWithKeysMatching(objectsToMatch, key, query='') {
  if (query.length < 2) {
    return EMPTY_ARRAY;
  }

  const searchRegexString = query
  // Sanitize special chars
    .replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&')
    .trim()
    .split(' ')
    // Only use terms longer than 1 char
    .filter(term => term.length > 1)
    // Search ahead when multiple terms provided
    .join('(\\S)*(\\s)+(.)*')

  const searchRegex = new RegExp(searchRegexString, 'i');

  const matches = [];
  for (let i = 0; i < objectsToMatch.length; i++) {
    const obj = objectsToMatch[i];
    if (searchRegex.test(obj[key])) {
      matches.push(obj);
    }
  }
  return matches;
}
