import {toSnakeCase} from '../utils/collection-utils';
import $ from 'jquery';
import _ from 'lodash';

/**
 * Pushes actions onto the window's history that have a "meta: {pushHistory: true}" set.
 * These actions are auto-dispatched on the window's "popstate" event (when clicking the back/forward button).
 */
export function browserHistoryMiddleware() {
  return next => {
    window.addEventListener('popstate', ev => {
      if (!ev.state) {
        window.location.reload(true);
        return;
      }
      if (_.isObject(ev.state) && isPushHistoryAction(ev.state)) {
        const prevAction = ev.state;
        // Get rid of the pushHistory meta flag before dispatching
        const newAction = { ...prevAction, meta: { ...prevAction.meta }};
        delete newAction.meta.pushHistory;
        next(newAction);
      }
    });

    return action => {
      if (isPushHistoryAction(action)) {
        const snakeCased = toSnakeCase(action.payload);
        // Use the snake cased payload as the url params
        const newHistory = window.location.pathname + '?' + encodeParams(snakeCased);
        window.history.pushState(action, null, newHistory);
      }
      return next(action);
    }
  }
}

function isPushHistoryAction(object) {
  return object.meta && object.meta.pushHistory;
}

function encodeParams(params) {
  return $.param(params);
}