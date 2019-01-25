// Import bare bones Observable without operators
import { Observable } from 'rxjs/Observable';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';

import _ from 'lodash';

Observable.prototype.pluckPayload = function(...keys) {
  return this.pluck('payload', ...keys);
};

Observable.prototype.flatAjax = function(apiOperation) {
  return this.flatMap(createApiOperationMapper(apiOperation));
};

Observable.prototype.switchAjax = function(apiOperation) {
  return this.switchMap(createApiOperationMapper(apiOperation));
};

function createApiOperationMapper(apiOperation) {
  return action => {
    const fsa = isFSA(action);
    const payload = fsa ? action.payload : action;
    const meta = { args: payload };
    // Transfer the existing operation metadata
    if (fsa && _.get(action, 'meta.operation')) {
      meta.operation = action.meta.operation;
    }

    let ajax$ = apiOperation(payload);
    if (!ajax$) {
      return empty();
    }

    if (!(ajax$ instanceof Observable)) {
      ajax$ = fromPromise(ajax$);
    }

    ajax$ = ajax$
      .map(ajaxResponse => {
        // Add normalized entities to the action metadata
        if (ajaxResponse && ajaxResponse.normalized) {
          const { normalized } = ajaxResponse;
          meta.entities = normalized.entities;
          if (_.isArray(normalized.result)) {
            meta.ids = normalized.result;
          }
          ajaxResponse = ajaxResponse.response;
        }
        return { payload: ajaxResponse, meta };
      })
      .catch(err => {
        return of({ error: true, payload: err, meta })
      });

    if (fsa) {
      ajax$ = ajax$.map(res => ({ ...res, type: `${action.type}_RESPONSE` }));
    }

    return ajax$;
  };
}

// Flux Standard Action (FSA) check
function isFSA(data) {
  return data && (data.type || data.payload || data.error || data.meta);
}
