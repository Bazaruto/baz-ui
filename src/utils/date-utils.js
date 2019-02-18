import Moment from 'moment-timezone';
import * as DateFormat from '../constants/date-format';

Moment.tz.setDefault('Etc/UTC');

export function formatDate(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.YEAR_MONTH_DAY);
}

export function formatDateTime(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.YEAR_MONTH_DAY_TIME);
}

export function formatDateRange(from, to) {
  return _formatDateRange(from, to, DateFormat.LONG);
}

export function formatShortDateRange(from, to) {
  return _formatDateRange(from, to, DateFormat.SHORT);
}

export function formatDateLong(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.LONG);
}

export function formateDateTimeWithZone(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.YEAR_MONTH_DAY_TIME_ZONE);
}

export function formatDateEasyToRead(date) {
  date = _ensureMoment(date);
  if (date.isSame(Moment(), 'd')) {
    return date.fromNow();
  }
  return date.format(DateFormat.YEAR_MONTH_DAY_TIME_ZONE);
}

export function ageFromDate(date) {
  date = _ensureMoment(date);
  return Moment().diff(date, 'years');
}

export function timeFromNow(date) {
  date = _ensureMoment(date);
  return date.fromNow();
}

export function formatShortDayMonth(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.SHORT_DAY_MONTH);
}

export function formatShortMonthYear(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.SHORT_MONTH_YEAR);
}

export function formatShortMonthDayYear(date) {
  date = _ensureMoment(date);
  return date.format(DateFormat.SHORT_MONTH_DAY_YEAR);
}

export function maxDate(dateA, dateB) {
  let momentA = _ensureMoment(dateA);
  let momentB = _ensureMoment(dateB);
  return Moment.max(momentA, momentB);
}

export function minDate(dateA, dateB) {
  let momentA = _ensureMoment(dateA);
  let momentB = _ensureMoment(dateB);
  return Moment.min(momentA, momentB);
}

export function applyUpdatedTime(date, time) {
  const [ hour, minute ] = time.split(':');
  const wDate = Moment(date);
  if (hour && minute) {
    wDate.set('hour', hour);
    wDate.set('minute', minute);
  }
  return formatDateTime(wDate);
}

function _ensureMoment(date) {
  return Moment.isMoment(date) ? date : Moment(date);
}

function _formatDateRange(from, to, format) {
  from = _ensureMoment(from);
  to = _ensureMoment(to);

  const startFormat = from.month() === to.month() && from.year() === to.year() ? 'D' : format;
  return from.format(startFormat) + ' - ' + to.format(format);
}
