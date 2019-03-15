export { ofType, flatAjax, switchAjax, pluckPayload } from './custom-operators';
export { ajaxEpic, switchAjaxEpic, debouncedAjaxEpic } from './ajax';

export const is = (action, type) => action.type === type;
