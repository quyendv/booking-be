export const Validator = {
  Date: {
    REGEX: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    message: (name: string): string => `${name} requires yyyy-mm-dd format`,
    PARSE_REGEX: /^(\d{4})-(\d{2})-(\d{2})$/,
  },
  File: {
    IMAGE_REGEX: /.(jpe?g|png)$/i,
  },
  Time: {
    REGEX: /^([01]?[0-9]|2[0-3]):00$/, // 00:00 - 23:00
    message: (name: string): string => `${name} requires hh:00 format`,
  },
};
