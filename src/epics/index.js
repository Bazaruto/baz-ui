export { flatAjax, switchAjax, pluckPayload } from './custom-operators';
export { ajaxEpic, switchAjaxEpic } from './ajax';

export const is = (action, type) => action.type === type;
