import moment from 'moment';
import {
  dateTimeAsIso,
  dateTimeAsUS,
  dateTimeFromNow,
  Interval,
  toClock,
  toDuration,
  toDurationInMilliseconds,
  toDurationInSeconds,
} from './dateTimeFormatters';

describe('date time formats', () => {
  const epoch = 1505634997920;
  const utcTime = moment.utc(epoch);
  const browserTime = moment(epoch);

  it('should format as iso date', () => {
    const expected = browserTime.format('YYYY-MM-DD HH:mm:ss');
    const actual = dateTimeAsIso(epoch, 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as iso date (in UTC)', () => {
    const expected = utcTime.format('YYYY-MM-DD HH:mm:ss');
    const actual = dateTimeAsIso(epoch, 0, 0, true);
    expect(actual).toBe(expected);
  });

  it('should format as iso date and skip date when today', () => {
    const now = moment();
    const expected = now.format('HH:mm:ss');
    const actual = dateTimeAsIso(now.valueOf(), 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as iso date (in UTC) and skip date when today', () => {
    const now = moment.utc();
    const expected = now.format('HH:mm:ss');
    const actual = dateTimeAsIso(now.valueOf(), 0, 0, true);
    expect(actual).toBe(expected);
  });

  it('should format as US date', () => {
    const expected = browserTime.format('MM/DD/YYYY h:mm:ss a');
    const actual = dateTimeAsUS(epoch, 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as US date (in UTC)', () => {
    const expected = utcTime.format('MM/DD/YYYY h:mm:ss a');
    const actual = dateTimeAsUS(epoch, 0, 0, true);
    expect(actual).toBe(expected);
  });

  it('should format as US date and skip date when today', () => {
    const now = moment();
    const expected = now.format('h:mm:ss a');
    const actual = dateTimeAsUS(now.valueOf(), 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as US date (in UTC) and skip date when today', () => {
    const now = moment.utc();
    const expected = now.format('h:mm:ss a');
    const actual = dateTimeAsUS(now.valueOf(), 0, 0, true);
    expect(actual).toBe(expected);
  });

  it('should format as from now with days', () => {
    const daysAgo = moment().add(-7, 'd');
    const expected = '7 days ago';
    const actual = dateTimeFromNow(daysAgo.valueOf(), 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as from now with days (in UTC)', () => {
    const daysAgo = moment.utc().add(-7, 'd');
    const expected = '7 days ago';
    const actual = dateTimeFromNow(daysAgo.valueOf(), 0, 0, true);
    expect(actual).toBe(expected);
  });

  it('should format as from now with minutes', () => {
    const daysAgo = moment().add(-2, 'm');
    const expected = '2 minutes ago';
    const actual = dateTimeFromNow(daysAgo.valueOf(), 0, 0, false);
    expect(actual).toBe(expected);
  });

  it('should format as from now with minutes (in UTC)', () => {
    const daysAgo = moment.utc().add(-2, 'm');
    const expected = '2 minutes ago';
    const actual = dateTimeFromNow(daysAgo.valueOf(), 0, 0, true);
    expect(actual).toBe(expected);
  });
});

describe('duration', () => {
  it('0 milliseconds', () => {
    const str = toDurationInMilliseconds(0, 0);
    expect(str).toBe('0 milliseconds');
  });
  it('1 millisecond', () => {
    const str = toDurationInMilliseconds(1, 0);
    expect(str).toBe('1 millisecond');
  });
  it('-1 millisecond', () => {
    const str = toDurationInMilliseconds(-1, 0);
    expect(str).toBe('1 millisecond ago');
  });
  it('seconds', () => {
    const str = toDurationInSeconds(1, 0);
    expect(str).toBe('1 second');
  });
  it('minutes', () => {
    const str = toDuration(1, 0, Interval.Minute);
    expect(str).toBe('1 minute');
  });
  it('hours', () => {
    const str = toDuration(1, 0, Interval.Hour);
    expect(str).toBe('1 hour');
  });
  it('days', () => {
    const str = toDuration(1, 0, Interval.Day);
    expect(str).toBe('1 day');
  });
  it('weeks', () => {
    const str = toDuration(1, 0, Interval.Week);
    expect(str).toBe('1 week');
  });
  it('months', () => {
    const str = toDuration(1, 0, Interval.Month);
    expect(str).toBe('1 month');
  });
  it('years', () => {
    const str = toDuration(1, 0, Interval.Year);
    expect(str).toBe('1 year');
  });
  it('decimal days', () => {
    const str = toDuration(1.5, 2, Interval.Day);
    expect(str).toBe('1 day, 12 hours, 0 minutes');
  });
  it('decimal months', () => {
    const str = toDuration(1.5, 3, Interval.Month);
    expect(str).toBe('1 month, 2 weeks, 1 day, 0 hours');
  });
  it('no decimals', () => {
    const str = toDuration(38898367008, 0, Interval.Millisecond);
    expect(str).toBe('1 year');
  });
  it('1 decimal', () => {
    const str = toDuration(38898367008, 1, Interval.Millisecond);
    expect(str).toBe('1 year, 2 months');
  });
  it('too many decimals', () => {
    const str = toDuration(38898367008, 20, Interval.Millisecond);
    expect(str).toBe('1 year, 2 months, 3 weeks, 4 days, 5 hours, 6 minutes, 7 seconds, 8 milliseconds');
  });
  it('floating point error', () => {
    const str = toDuration(36993906007, 8, Interval.Millisecond);
    expect(str).toBe('1 year, 2 months, 0 weeks, 3 days, 4 hours, 5 minutes, 6 seconds, 7 milliseconds');
  });
});

describe('clock', () => {
  it('size less than 1 second', () => {
    const str = toClock(999, 0);
    expect(str).toBe('999ms');
  });
  describe('size less than 1 minute', () => {
    it('default', () => {
      const str = toClock(59999);
      expect(str).toBe('59s:999ms');
    });
    it('decimals equals 0', () => {
      const str = toClock(59999, 0);
      expect(str).toBe('59s');
    });
  });
  describe('size less than 1 hour', () => {
    it('default', () => {
      const str = toClock(3599999);
      expect(str).toBe('59m:59s:999ms');
    });
    it('decimals equals 0', () => {
      const str = toClock(3599999, 0);
      expect(str).toBe('59m');
    });
    it('decimals equals 1', () => {
      const str = toClock(3599999, 1);
      expect(str).toBe('59m:59s');
    });
  });
  describe('size greater than or equal 1 hour', () => {
    it('default', () => {
      const str = toClock(7199999);
      expect(str).toBe('01h:59m:59s:999ms');
    });
    it('decimals equals 0', () => {
      const str = toClock(7199999, 0);
      expect(str).toBe('01h');
    });
    it('decimals equals 1', () => {
      const str = toClock(7199999, 1);
      expect(str).toBe('01h:59m');
    });
    it('decimals equals 2', () => {
      const str = toClock(7199999, 2);
      expect(str).toBe('01h:59m:59s');
    });
  });
  describe('size greater than or equal 1 day', () => {
    it('default', () => {
      const str = toClock(89999999);
      expect(str).toBe('24h:59m:59s:999ms');
    });
    it('decimals equals 0', () => {
      const str = toClock(89999999, 0);
      expect(str).toBe('24h');
    });
    it('decimals equals 1', () => {
      const str = toClock(89999999, 1);
      expect(str).toBe('24h:59m');
    });
    it('decimals equals 2', () => {
      const str = toClock(89999999, 2);
      expect(str).toBe('24h:59m:59s');
    });
  });
});
