import { timer } from 'rxjs/observable/timer';
import { empty } from 'rxjs/observable/empty';

export function ajaxEpic(type, operation) {
  return action$ =>
    action$
      .ofType(type)
      .flatAjax(operation);
}

export function switchAjaxEpic(type, operation) {
  return action$ =>
    action$
      .ofType(type)
      // Conditional grouping
      .groupBy(a => a.meta && a.meta.group || 'none')
      .flatMap(groupedAction$ =>
        groupedAction$
          // Conditional debouncing
          .debounce(a => {
            if (a.meta && a.meta.debounceTime) {
              return timer(a.meta.debounceTime);
            }
            return empty();
          })
          .switchAjax(operation)
      );
}
