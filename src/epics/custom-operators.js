import { Observable, from, of, empty, asyncScheduler } from 'rxjs';
import { flatMap, switchMap, pluck, map, catchError, throttleTime, takeUntil, debounceTime } from 'rxjs/operators';
import _ from 'lodash';

export { ofType } from 'redux-observable';

export function trailingThrottle(millis) {
  return throttleTime(millis, asyncScheduler, { leading: true, trailing: true });
}

export function pluckPayload(...keys) {
  return pluck('payload', ...keys);
}

export function createAjaxOperators(options = { errorSuffix: 'ERROR' }) {
  function flatAjax(apiOperation) {
    return flatMap(makeAjaxObservableFactory(apiOperation));
  }

  function switchAjax(apiOperation) {
    return switchMap(makeAjaxObservableFactory(apiOperation));
  }

  function debounceAjax(apiOperation, debounceMs=400) {
    const createAjaxObservable = makeAjaxObservableFactory(apiOperation);
    return observable =>
      observable.pipe(
        debounceTime(debounceMs),
        switchMap(action => {
          /*
            We want to immediately cancel the ajax that is in progress
            when another event comes into play, because if we don't, there is
            a chance that we will still be debouncing (which takes "debounceMs"
            before hitting this "switchMap") when the ajax response comes back.
           */
          return createAjaxObservable(action).pipe(takeUntil(observable));
        })
      );
  }

  function makeAjaxObservableFactory(apiOperation) {
    return function createAjaxObservable(action) {
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
            type: `${action.type}_${res.error ? options.errorSuffix : 'RESPONSE'}`
          }))
        );
      }

      return ajax$;
    };
  }

  return {
    flatAjax,
    switchAjax,
    debounceAjax,
  }
}

export const { flatAjax, switchAjax, debounceAjax } = createAjaxOperators();

// Flux Standard Action (FSA) check
function isFSA(data) {
  return data && (data.type || data.payload || data.error || data.meta);
}
