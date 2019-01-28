import { timer, empty } from 'rxjs';
import { filter, groupBy, flatMap, debounce } from 'rxjs/operators';
import { switchAjax, flatAjax } from './rx-extensions'

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
          // Conditional debouncing
          debounce(a => {
            if (a.meta && a.meta.debounceTime) {
              return timer(a.meta.debounceTime);
            }
            return empty();
          }),
          switchAjax(operation)
        )
      )
    );
}
