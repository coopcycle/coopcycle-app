export function areSameDates(date1, date2) {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export function seconds(n) {
  return n * SECOND;
}

export function minutes(n) {
  return n * MINUTE;
}

export function hours(n) {
  return n * HOUR;
}
