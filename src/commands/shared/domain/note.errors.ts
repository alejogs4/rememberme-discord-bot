export const BAD_DATE_FORMAT_MESSAGE = 'Date typed is in the incorrect format';

export const DATABASE_ERROR_MESSAGE = 'We got an error, please try again!';

export class BadDateFormat extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

interface ErrorConstructor {
  new (message: string): Error;
}

export function wrapErrorWithConstructor(errorConstructor: ErrorConstructor, message: string) {
  return () => {
    throw new errorConstructor(message);
  };
}

export const throwDatabaseError = wrapErrorWithConstructor(DatabaseError, DATABASE_ERROR_MESSAGE);