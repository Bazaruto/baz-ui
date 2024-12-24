import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { DateFormat } from "../constants/DateFormat";

dayjs.extend(utc);

export function formatDate(date: string, format = DateFormat.YEAR_MONTH_DAY) {
  return _ensureDay(date).format(format);
}

export function formatDateTime(date: string) {
  return formatDate(date, DateFormat.YEAR_MONTH_DAY_TIME);
}

export function _ensureDay(date: string | dayjs.Dayjs) {
  if (dayjs.isDayjs(date)) return date;
  return dayjs.utc(date);
}
