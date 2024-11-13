import { DateFormat } from '../model/DateFormat';

const getDate = function(date: any): Date {
  if (!date) { return undefined; }
  if (!(date instanceof Date)) {
    if (!date.split) { return undefined; }
    date = new Date(date.split('T')[0]);
  }
  const offset = date.getTimezoneOffset();
  if (isNaN(offset)) {
    return undefined;
  }
  return date;
};

/*
  const ticks = date.getTime();
  const adjusted = ticks + (offset * 60 * 1000);
  const adjustedDate = new Date(adjusted);
  return adjustedDate;
*/
const oldDateToJSON = Date.prototype.toJSON;

Date.prototype.toJSON = function() {
  return serverDate(this);
};



const dateParts = function(date: any) {
  if (!date) { return undefined; }
  if (!(date instanceof Date)) {
    date = new Date(date.split('T')[0]);
  }
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  let day = date.getDate().toString();
  if (day.length === 1) {
    day = '0' + day;
  }
  return { day, month, year };
};

const serverDate = function(date: Date): string {
  if (!date) { return ''; }
  const parts = dateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const displayDate = function(date: Date): string {
  if (!date) { return ''; }
  const parts = dateParts(date);
  return `${parts.day}/${parts.month}/${parts.year}`;
};

export const api = {
  oldDateToJSON,
  guid: () => {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  formatDate(date: any, format: DateFormat = DateFormat.Server): string {
    if (!date) {
      return '';
    }
    date = getDate(date);
    if (format === DateFormat.Server) {
      return serverDate(date);
    }
    return displayDate(date);
  }
};

export default api;

