import { EMPTY_ARRAY } from '../constants';

export function findWithMatchingFields<T, K extends keyof T>(
  collection: T[],
  { fieldToMatch }: { fieldToMatch: K },
  query = ''
) {
  if (query.length < 2) {
    return EMPTY_ARRAY;
  }

  const searchRegexString = query
    .trim()
    .split(' ')
    // Only use terms longer than 1 char
    .filter(term => term.trim().length > 1)
    // Sanitize special chars
    .map(term => term.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'))
    // Search ahead when multiple terms provided
    .join('(\\S)*(\\s)+(.)*');

  const searchRegex = new RegExp(searchRegexString, 'i');

  const matches = [];
  for (let i = 0; i < collection.length; i++) {
    const obj = collection[i];
    const field = obj[fieldToMatch] as any;
    if (searchRegex.test(field)) {
      matches.push(obj);
    }
  }
  return matches;
}
