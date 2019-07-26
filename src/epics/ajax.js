import { filter, groupBy, flatMap } from 'rxjs/operators';
import { switchAjax, flatAjax, debounceAjax } from './custom-operators'

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
          debounceAjax(operation, debounceMs)
        )
      )
    );
}