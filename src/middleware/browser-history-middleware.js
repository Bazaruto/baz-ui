import {toSnakeCase} from '../utils/collection-utils';
import $ from 'jquery';

export function browserHistoryMiddleware() {
  return next => action => {
    if (action.meta && action.meta.pushHistory) {
      // Snake case the payload
      const popState = toSnakeCase(action.payload);
      const pushHistory = window.location.pathname + '?' + encodeParams(popState);
      window.history.pushState(popState, null, pushHistory);
    }
    return next(action);
  }
}

function encodeParams(params) {
  return $.param(params);
}