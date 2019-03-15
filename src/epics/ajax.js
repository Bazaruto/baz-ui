import { timer, empty } from 'rxjs';
import { filter, groupBy, flatMap, debounceTime } from 'rxjs/operators';
import { switchAjax, flatAjax } from './custom-operators'

export function ajaxEpic(type, operation) {
  return action$ =>
    action$.pipe(
      filter(a => a.type === type),
      flatAjax(operation)
    );
}

export function switchAjaxEpic(type, operation) {
  return action$ =>
    action$.pipe(
      filter(a => a.type === type),
      // Conditional grouping
      groupBy(a => a.meta && a.meta.group || 'none'),
      flatMap(groupedAction$ =>
        groupedAction$.pipe(
          switchAjax(operation)
        )
      )
    );
}

export function debouncedAjaxEpic(type, operation, debounceMs=400) {
  return action$ =>
    action$.pipe(
      filter(a => a.type === type),
      // Conditional grouping
      groupBy(a => a.meta && a.meta.group || 'none'),
      flatMap(groupedAction$ =>
        groupedAction$.pipe(
          debounceTime(debounceMs),
          switchAjax(operation)
        )
      )
    );
}