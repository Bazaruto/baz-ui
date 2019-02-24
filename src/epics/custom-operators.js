import { Observable, from, of, empty, asyncScheduler } from 'rxjs';
import { flatMap, switchMap, pluck, map, catchError, throttleTime } from 'rxjs/operators';
import _ from 'lodash';

export function trailingThrottle(millis) {
  return throttleTime(millis, asyncScheduler, { leading: true, trailing: true });
}

export function pluckPayload(...keys) {
  return pluck('payload', ...keys);
}

export function flatAjax(apiOperation) {
  return flatMap(createApiOperationMapper(apiOperation));
}

export function switchAjax(apiOperation) {
  return switchMap(createApiOperationMapper(apiOperation));
}

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
      ajax$ = from(ajax$);
    }

    ajax$ = ajax$.pipe(
      map(ajaxResponse => {
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
      }),
      catchError(err => {
        return of({ error: true, payload: err, meta })
      })
    );

    if (fsa) {
      ajax$ = ajax$.pipe(
        map(res => ({
          ...res,
          type: `${action.type}_${res.error ? 'ERROR' : 'RESPONSE'}`
        }))
      );
    }

    return ajax$;
  };
}

// Flux Standard Action (FSA) check
function isFSA(data) {
  return data && (data.type || data.payload || data.error || data.meta);
}
