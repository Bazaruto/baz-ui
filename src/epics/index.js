import './rx-extensions';

export { ajaxEpic, switchAjaxEpic } from './ajax';

export const is = (action, type) => action.type === type;
