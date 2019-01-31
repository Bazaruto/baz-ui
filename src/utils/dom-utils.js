import {EMPTY_OBJECT} from '../constants';

export function copyElementAndChildrenToClipboard(elem) {
  let range;
  let sel;
  // Select and copy the results table
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(elem);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(elem);
      sel.addRange(range);
    }
  } else if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(elem);
    range.select();
  }
  document.execCommand('Copy');

  // Clears out the selection items
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

export function changeLocation(url) {
  window.location.assign(url);
}

export function getUrlParams() {
  const searchParamsStr = window.location.search.substring(1);
  if (!searchParamsStr) {
    return EMPTY_OBJECT;
  }
  const encodedPairs = searchParamsStr.split('&');
  const params = {};
  for (let i = 0; i < encodedPairs.length; i++) {
    const [key, value] = encodedPairs[i].split('=');
    params[key] = decodeURIComponent(value);
  }
  return params;
}
