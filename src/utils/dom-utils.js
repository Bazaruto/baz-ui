import {EMPTY_OBJECT} from '../constants';
import {isNil, isArray} from 'lodash';

export function getUrlSearchParams(url) {
  // get query string from url (optional) or window
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  if (!queryString) {
    return EMPTY_OBJECT;
  }

  const urlParams = {};
  // stuff after # is not part of query string, so get rid of it
  queryString = queryString.split('#')[0];
  // split our query string into its component parts
  const encodedPairs = queryString.split('&');

  for (let i = 0; i < encodedPairs.length; i++) {
    const [encodedName, encodedValue] = encodedPairs[i].split('=');
    const paramName = decodeURIComponent(encodedName);
    const paramValue = getParamValue(encodedValue);

    // process entries ending with square brackets as arrays, e.g. words[] or words[2]
    if (paramName.match(/\[(\d+)?\]$/)) {
      processSquareBracketEntry(urlParams, paramName, paramValue);
      continue;
    }

    // process existing entries as arrays
    if (urlParams.hasOwnProperty(paramName)) {
      processExistingEntry(urlParams, paramName, paramValue);
      continue;
    }

    urlParams[paramName] = paramValue;
  }

  return urlParams;
}

function getParamValue(encodedValue) {
  if (isNil(encodedValue)) {
    return true;
  }
  const value = decodeURIComponent(encodedValue);
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return value;
  }
}

function processSquareBracketEntry(urlParams, paramName, paramValue) {
  const key = paramName.replace(/\[(\d+)?\]/, '');
  // create key if it doesn't exist
  if (!urlParams[key]) {
    urlParams[key] = [];
  }

  // if it's an indexed array e.g. words[2]
  if (paramName.match(/\[\d+\]$/)) {
    // get the index value and add the entry at the appropriate position
    const index = /\[(\d+)\]/.exec(paramName)[1];
    urlParams[key][index] = paramValue;
    return;
  }

  urlParams[key].push(paramValue);
}

function processExistingEntry(urlParams, paramName, paramValue) {
  if (!isArray(urlParams[paramName])) {
    urlParams[paramName] = [urlParams[paramName]];
  }
  urlParams[paramName].push(paramValue);
}
