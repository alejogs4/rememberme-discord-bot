export const BAD_DATE_FORMAT_MESSAGE = 'Date typed is in the incorrect format';

export class BadDateFormat extends Error {
  constructor(message: string) {
    super(message);
  }
}
