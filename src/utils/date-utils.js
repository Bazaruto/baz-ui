import Moment from 'moment';

export const YEAR_MONTH_DAY = 'YYYY-MM-DD';
export const YEAR_MONTH_DAY_TIME = 'YYYY-MM-DD HH:mm';

export function formatDate(date, format=YEAR_MONTH_DAY) {
  return _ensureMoment(date).format(format);
}

export function formatDateTime(date) {
  return formatDate(date, YEAR_MONTH_DAY_TIME);
}

function _ensureMoment(date) {
  return Moment.isMoment(date) ? date : Moment(date);
}
