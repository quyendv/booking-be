const REGEX = RegExp('^[+-]\\d{2}:\\d{2}$');

export class DateUtils {
  static parseDate(strDate: string): Date {
    const dateParts = strDate.split('-');
    return new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  }

  static formatDateToYYYYMMDD(date: Date): string {
    return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
      date.getMonth() + 1,
      2,
    )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)}`;
  }

  static padWithLeadingZeros(num: number, totalLength: number): string {
    return String(num).padStart(totalLength, '0');
  }

  //timezone format in "(+/-)(HH:mm)"
  static parseDateWithTimezoneToUTC(strDate: string, timezone: string): string {
    const date = DateUtils.parseDate(strDate);

    if (REGEX.test(timezone)) {
      if (timezone.startsWith('+')) {
        date.setDate(date.getDate() - 1);
        const parts = timezone.substring(1).split(':');
        let hoursStr;
        let minsStr;
        const mins = 60 - parseInt(parts[1]);
        if (mins == 60) {
          const hours = 24 - parseInt(parts[0]);
          minsStr = DateUtils.padWithLeadingZeros(0, 2);
          hoursStr = DateUtils.padWithLeadingZeros(hours, 2);
        } else {
          const hours = 24 - parseInt(parts[0]) - 1;
          minsStr = DateUtils.padWithLeadingZeros(mins, 2);
          hoursStr = DateUtils.padWithLeadingZeros(hours, 2);
        }
        return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
          date.getMonth() + 1,
          2,
        )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)}T${hoursStr}:${minsStr}:00Z`;
      } else {
        return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
          date.getMonth() + 1,
          2,
        )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)}T${timezone.substring(1)}:00Z`;
      }
    } else {
      throw Error('wrong format timezone');
    }
  }

  // Eg: format 2024-02-16 (timezone '+07:00') to 2024-02-15 17:00:00 (instead of 2024-02-15T17:00:00Z in above function)
  static parseDateWithTimezoneToNonStandardUTC(strDate: string, timezone: string): string {
    const date = DateUtils.parseDate(strDate);

    if (REGEX.test(timezone)) {
      if (timezone.startsWith('+')) {
        date.setDate(date.getDate() - 1);
        const parts = timezone.substring(1).split(':');
        let hoursStr;
        let minsStr;
        const mins = 60 - parseInt(parts[1]);
        if (mins == 60) {
          const hours = 24 - parseInt(parts[0]);
          minsStr = DateUtils.padWithLeadingZeros(0, 2);
          hoursStr = DateUtils.padWithLeadingZeros(hours, 2);
        } else {
          const hours = 24 - parseInt(parts[0]) - 1;
          minsStr = DateUtils.padWithLeadingZeros(mins, 2);
          hoursStr = DateUtils.padWithLeadingZeros(hours, 2);
        }
        return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
          date.getMonth() + 1,
          2,
        )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)} ${hoursStr}:${minsStr}:00`;
      } else {
        return `${date.getFullYear()}-${DateUtils.padWithLeadingZeros(
          date.getMonth() + 1,
          2,
        )}-${DateUtils.padWithLeadingZeros(date.getDate(), 2)} ${timezone.substring(1)}:00`;
      }
    } else {
      throw Error('wrong format timezone');
    }
  }

  static parseDateWithTimezone(
    date: Date,
    offset = 7,
  ): {
    year: string;
    month: string;
    day: string;
    hours: string;
    minutes: string;
    seconds: string;
  } {
    const utc = date.getTime() + date.getTimezoneOffset() * 60 * 1000; // get utc milliseconds
    const timezoneDate = new Date(utc + offset * 60 * 60 * 1000); // get Date instance, ISO type (can convert to any timezone)

    // Get date time from UTC +- offset. NOTE: all method below convert to local time
    const hours = timezoneDate.getHours();
    const minutes = timezoneDate.getMinutes();
    const seconds = timezoneDate.getSeconds();
    const day = timezoneDate.getDate();
    const month = timezoneDate.getMonth() + 1;
    const year = timezoneDate.getFullYear();

    return {
      year: DateUtils.padWithLeadingZeros(year, 2),
      month: DateUtils.padWithLeadingZeros(month, 2),
      day: DateUtils.padWithLeadingZeros(day, 2),
      hours: DateUtils.padWithLeadingZeros(hours, 2),
      minutes: DateUtils.padWithLeadingZeros(minutes, 2),
      seconds: DateUtils.padWithLeadingZeros(seconds, 2),
    };
  }

  static getCurrentTimeAtTimezone(offset = 7): { date: string; time: string } {
    const now = new Date();
    const parsed = DateUtils.parseDateWithTimezone(now, offset);

    const dateArr = [parsed.year, parsed.month, parsed.day];
    const timeArr = [parsed.hours, parsed.minutes, parsed.seconds];

    return {
      date: dateArr.join('-'),
      time: timeArr.join(':'),
    };
  }

  static formatDateToYYYYMMDDHHMMSS(date: Date, offset = 7): string {
    const parsed = DateUtils.parseDateWithTimezone(date, offset);

    const arr = [
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.hours,
      parsed.minutes,
      parsed.seconds,
    ];

    return arr.join('');
  }

  static getDaysBetweenDates(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const oneDay = 1000 * 60 * 60 * 24;
    const diffMs = Math.abs(end.getTime() - start.getTime());

    const daysBetween = Math.round(diffMs / oneDay);
    return daysBetween + 1;
  }

  static addDays(strDate: string, numDays: number): Date {
    const date = DateUtils.parseDate(strDate);
    date.setDate(date.getDate() + numDays);
    return date;
  }

  static getNextDaysOf(strDate: string): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, 1));
  }

  static getYesterdaysOf(strDate: string): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, -1));
  }

  static getAfterDaysOf(strDate: string, days: number): string {
    return DateUtils.formatDateToYYYYMMDD(DateUtils.addDays(strDate, days));
  }

  // static getMinMaxDate(dateStr1: string, dateStr2: string, isMin: boolean): string {
  //   const date1 = DateUtils.parseDate(dateStr1);
  //   const date2 = DateUtils.parseDate(dateStr2);
  //   if (isMin) {
  //     return date1 < date2 ? dateStr1 : dateStr2;
  //   } else {
  //     return date1 > date2 ? dateStr1 : dateStr2;
  //   }
  // }

  static getMinDate(dateStr1: string, dateStr2: string): string {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 < date2 ? dateStr1 : dateStr2;
  }

  static getMaxDate(dateStr1: string, dateStr2: string): string {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 > date2 ? dateStr1 : dateStr2;
  }

  static isBefore(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 < date2;
  }

  static isAfter(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 > date2;
  }

  static isEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1.getTime() === date2.getTime();
  }

  static isBetween(dateStr: string, startDateStr: string, endDateStr: string): boolean {
    const date = DateUtils.parseDate(dateStr);
    const startDate = DateUtils.parseDate(startDateStr);
    const endDate = DateUtils.parseDate(endDateStr);
    return date >= startDate && date <= endDate;
  }

  static isBeforeOrEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 <= date2;
  }

  static isAfterOrEquals(dateStr1: string, dateStr2: string): boolean {
    const date1 = DateUtils.parseDate(dateStr1);
    const date2 = DateUtils.parseDate(dateStr2);
    return date1 >= date2;
  }

  static getDateRangeOfQuarter(year: number, quarter: number): { start: string; end: string } {
    if (quarter < 1 || quarter > 4) {
      throw new Error('Quarter must be between 1 and 4');
    }

    const startDate = new Date(year, (quarter - 1) * 3, 1);
    const endDate = new Date(year, quarter * 3, 0);

    return {
      start: DateUtils.formatDateToYYYYMMDD(startDate),
      end: DateUtils.formatDateToYYYYMMDD(endDate),
    };
  }

  static getDateRangeOfMonth(year: number, month: number): { start: string; end: string } {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return {
      start: DateUtils.formatDateToYYYYMMDD(startDate),
      end: DateUtils.formatDateToYYYYMMDD(endDate),
    };
  }

  static splitIntoTenDayIntervals(
    startDate: string,
    endDate: string,
    interval = 10,
  ): [string, string][] {
    if (interval < 1) throw new Error('Interval must be greater than 0');

    if (DateUtils.isAfter(startDate, endDate)) {
      throw new Error('Start date must be before end date');
    }

    let currentStart = startDate;
    let currentEnd = DateUtils.getAfterDaysOf(currentStart, interval - 1);

    const intervals: [string, string][] = [];

    while (DateUtils.isAfter(endDate, currentEnd)) {
      intervals.push([currentStart, currentEnd]);
      currentStart = DateUtils.getNextDaysOf(currentEnd);
      currentEnd = DateUtils.getAfterDaysOf(currentStart, interval - 1);
    }

    // Add the last interval
    intervals.push([currentStart, endDate]);
    return intervals;
  }

  static splitRangeIntoMonths(start: string, end: string): { start: string; end: string }[] {
    let startDate = new Date(start);
    const endDate = new Date(end);
    const result: { start: string; end: string }[] = [];

    while (startDate < endDate) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const lastDayOfMonth = new Date(year, month + 1, 0);

      if (lastDayOfMonth < endDate) {
        result.push({
          start: DateUtils.formatDateToYYYYMMDD(startDate),
          end: DateUtils.formatDateToYYYYMMDD(lastDayOfMonth),
        });
      } else {
        result.push({
          start: DateUtils.formatDateToYYYYMMDD(startDate),
          end: end,
        });
      }
      // startDate.setMonth(month + 1); // month range is wrong if startDate is not first of month, eg: 2024-01-15 - 2024-12-31 will return [2024-01-15, 2022-01-31], [2022-02-15, 2022-02-28], ...
      startDate = new Date(year, month + 1, 1); // always set from [startDate, lastDateOfMonth]
    }
    return result;
  }
}
