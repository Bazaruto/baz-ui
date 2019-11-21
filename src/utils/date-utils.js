import Moment from 'moment';
import * as DateFormat from '../constants/date-format';

export function getToday() {
  return formatDate(new Date());
}

export function addDays(date, numberOfDays) {
  return formatDate(Moment(date).add(numberOfDays, 'days'));
}

export function addDay(date) {
  return addDays(date, 1);
}

export function formatDate(date, format=DateFormat.YEAR_MONTH_DAY) {
  return _ensureMoment(date).format(format);
}

export function formatDateTime(date) {
  return formatDate(date, DateFormat.YEAR_MONTH_DAY_TIME);
}

export function formatDateRange(from, to, format=DateFormat.LONG) {
  from = _ensureMoment(from);
  to = _ensureMoment(to);

  const startFormat = from.month() === to.month() && from.year() === to.year() ? 'D' : format;
  return from.format(startFormat) + ' - ' + to.format(format);
}

export function formatShortDateRange(from, to) {
  return formatDateRange(from, to, DateFormat.SHORT);
}

export function formatDateLong(date) {
  return formatDate(date, DateFormat.LONG);
}

export function formatDateTimeWithZone(date) {
  return formatDate(date, DateFormat.YEAR_MONTH_DAY_TIME_ZONE);
}

export function formatDateEasyToRead(date) {
  date = _ensureMoment(date);
  if (date.isSame(Moment(), 'd')) {
    return date.fromNow();
  }
  return date.format(DateFormat.YEAR_MONTH_DAY_TIME_ZONE);
}

export function formatShortDayMonth(date) {
  return formatDate(date, DateFormat.SHORT_DAY_MONTH);
}

export function formatShortMonthYear(date) {
  return formatDate(date, DateFormat.SHORT_MONTH_YEAR);
}

export function formatShortMonthDayYear(date) {
  return formatDate(date, DateFormat.SHORT_MONTH_DAY_YEAR);
}

export function getDateDifference(from, to, measurement='days') {
  return Moment(to).diff(from, measurement);
}

export function ageFromDate(date) {
  date = _ensureMoment(date);
  return Moment().diff(date, 'years');
}

export function timeFromNow(date) {
  date = _ensureMoment(date);
  return date.fromNow();
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
  const [hour, minute] = time.split(':');
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
