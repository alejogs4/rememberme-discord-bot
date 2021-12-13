import { isValidURL } from './notes.validators';
import { BadDateFormat, BAD_DATE_FORMAT_MESSAGE, wrapErrorWithConstructor } from './note.errors';

describe('Shared domain logic tests', () => {
  test('Should return true if is a valid url false otherwise', () => {
    const cases = [
      { url: 'https://google.com', expected: true },
      { url: 'http://google.com', expected: true },
      { url: 'https://ed.team/courses?id=1024', expected: true },
      { url: 'google.com', expected: false },
      { url: 'www.google.com', expected: false },
      { url: 'this will never be valid', expected: false },
    ];

    cases.forEach((testCase) => {
      expect(isValidURL(testCase.url)).toBe(testCase.expected);
    });
  });

  test('Should throw an error with the specified error message', () => {
    const throwDatabaseError = wrapErrorWithConstructor(BadDateFormat, BAD_DATE_FORMAT_MESSAGE);

    try {
      throwDatabaseError();
      throw new Error('This should have thrown before');
    } catch (err) {
      // @ts-ignore
      expect(err.message).toBe(BAD_DATE_FORMAT_MESSAGE);
      expect(err).toBeInstanceOf(BadDateFormat);
    }
  });
});
