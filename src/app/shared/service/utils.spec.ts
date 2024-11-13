import { api } from './utils';

const testUtils = {
  dateParts: function (date: any) {
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
  },
  formatDate: function (date: any): Date {
    if (!date) { return undefined; }
    if (!(date instanceof Date)) {
      date = new Date(date.split('T')[0]);
    }
    const offset = date.getTimezoneOffset();
    const ticks = date.getTime();
    const adjusted = ticks - (offset * 60 * 1000);
    const adjustedDate = new Date(adjusted);
    return adjustedDate;
  }
};

describe('formatDate', () => {

  it('should handle null values', () => {
    const date = null;
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual('');
  });
  it('should handle undefined values', () => {
    const date = undefined;
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual('');
  });
  it('should handle empty string', () => {
    const date = '';
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual('');
  });

  it('should handle non date string', () => {
    const date = 'srgesg';
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual('');
  });

  it('should handle date string without time', () => {
    const date = '2017-08-26';
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual(date);
  });

  it('should handle date string with time', () => {
    const date = '2017-08-26T00:00:00';
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual('2017-08-26');
  });

  it('fails with the old toJSON (if we don\'t adjust for timezone offset)', () => {
    const date = new Date('2017-09-25T00:00:00'); //  new Date(2017, 8, 25);
    const correctOutput = '2017-09-25';

    const offset = date.getTimezoneOffset();
    const wrongDate = api.oldDateToJSON.bind(date)().split('T')[0];
    expect(wrongDate).not.toEqual(correctOutput);
    expect(wrongDate).toEqual('2017-09-24');
  });

  it('works with the patched date.toJSON()', () => {

    const date = new Date('2017-09-25T00:00:00'); //  new Date(2017, 8, 25);
    const correctOutput = '2017-09-25';
    const correctDate = testUtils.formatDate(date).toISOString().split('T')[0];
    expect(correctDate).toEqual(correctOutput);

    const date2 = new Date(2017, 8, 25);
    const correctOutput2 = '2017-09-25';
    const correctDate2 = testUtils.formatDate(date).toISOString().split('T')[0];
    expect(correctDate2).toEqual(correctOutput2);

  });

  it ('works with api.formatDate', () => {
    const date = new Date('2017-09-25T00:00:00'); //  new Date(2017, 8, 25);
    const correctOutput = '2017-09-25';
    // testing the actual api method
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual(correctOutput); // NB zero indexed month
  });

  it('we can perform the same operation without the date going wrong', () => {
    const date = new Date('2017-09-25T00:00:00'); //  new Date(2017, 8, 25);
    const correctOutput = '2017-09-25';
    const adjusted = api.formatDate(date);
    expect(adjusted).toEqual(correctOutput); // NB zero indexed month
    const adjustedAgain = api.formatDate(adjusted);
    expect(adjustedAgain).toEqual(correctOutput);
    expect(api.formatDate(new Date(adjustedAgain))).toEqual(correctOutput);
  });

  it('json.parse works correctly with patched date.toJSON()', () => {
    const obj = {
      date: new Date('2017-09-25T00:00:00')
    };
    const serialized = JSON.stringify(obj);
    const deserialized = JSON.parse(serialized);
    expect(deserialized.date).toEqual('2017-09-25');
  });

  it('displayDate should return empty string if no date provided', () => {
    expect(testUtils.dateParts(null)).toBeUndefined();
  });

});



