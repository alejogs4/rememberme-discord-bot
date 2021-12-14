import { add } from 'date-fns';
import { createMock } from 'ts-auto-mock';

import { NoteContent } from '../../shared/domain/note';
import { BadDateFormat, InvalidDate } from '../../shared/domain/note.errors';
import { fromDateStringToDate, sanitizeNoteContent } from './remember.mappers';

function differenceIsProper(numberOne: number, numberTwo: number): boolean {
  const errorToleranceRange = 0.0001 * numberOne;
  const lowerLimit = numberOne - errorToleranceRange;
  const upperLimit = numberOne + errorToleranceRange;

  return numberTwo <= upperLimit && numberTwo >= lowerLimit;
}

describe('Remember domain tests', () => {
  describe('fromDateStringToDate tests', () => {
    test('Should add three minutes to current date', () => {
      const currentDate = new Date();
      const newDate = fromDateStringToDate('3m', currentDate);

      const THREE_MINUTES = 1000 * 60 * 3;
      const threeMinutesDifference = newDate.getTime() - currentDate.getTime();

      expect(differenceIsProper(threeMinutesDifference, THREE_MINUTES)).toBe(true);
    });

    test('Should add two hours to current date', () => {
      const currentDate = new Date();
      const newDate = fromDateStringToDate('2h', currentDate);

      const TWO_HOURS = 1000 * 60 * 60 * 2;
      const twoHoursDifference = newDate.getTime() - currentDate.getTime();

      expect(differenceIsProper(twoHoursDifference, TWO_HOURS)).toBe(true);
    });

    test('Should add n months to given date', () => {
      const currentDate = new Date();
      const newDate = fromDateStringToDate('2M', currentDate);
      const expectedDate = add(currentDate, { months: 2 });

      expect(differenceIsProper(newDate.getTime(), expectedDate.getTime())).toBe(true);
    });

    test('Should return specific date as long as passed dated is well formatted', () => {
      const FORMAT_ONE_DATE = '2022/02/01';
      const FORMAT_TWO_DATE = '2022-02-01';

      const dateOne = new Date('2022/02/01');
      const dateTwo = new Date('2022/02/01');

      const dateWithFirstFormat = fromDateStringToDate(FORMAT_ONE_DATE);
      const dateWithSecondFormat = fromDateStringToDate(FORMAT_TWO_DATE);

      expect(differenceIsProper(dateWithFirstFormat.getTime(), dateOne.getTime())).toBe(true);
      expect(differenceIsProper(dateWithSecondFormat.getTime(), dateTwo.getTime())).toBe(true);
    });

    test('Should throw an error if date is wrongly passed', () => {
      try {
        fromDateStringToDate('3');
        throw new Error('This should have failed');
      } catch (error) {
        expect(error).toBeInstanceOf(BadDateFormat);
      }

      try {
        fromDateStringToDate('m');
        throw new Error('This should have failed');
      } catch (error) {
        expect(error).toBeInstanceOf(BadDateFormat);
      }
    });

    test('Should throw an error if target date is less than current date', () => {
      try {
        fromDateStringToDate('-1m');
        throw new Error('This should have failed');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidDate);
      }
    });

    test('Should throw an error if date is passed in an invalid format', () => {
      try {
        const INVALID_FORMAT = '20201/0123/01';
        fromDateStringToDate(INVALID_FORMAT);
        throw new Error('This should have failed');
      } catch (error) {
        expect(error).toBeInstanceOf(BadDateFormat);
      }
    });
  });

  describe('Sanitize content tests', () => {
    test('Should replace urls with encoded versions', () => {
      const initialURL = 'https://hello.com?=ddå';
      const expectedEncodedURL = 'https://hello.com?=dd%C3%A5';
      const content = `this is content ${initialURL}`;

      const note = createMock<NoteContent>({ content: sanitizeNoteContent(content) });

      expect(note.content.includes(expectedEncodedURL)).toBe(true);
      expect(note.content.includes(initialURL)).toBe(false);
    });

    test('Should not replace nothing if content has not urls', () => {
      const content = 'this is content with not urls';
      const note = createMock<NoteContent>({ content: sanitizeNoteContent(content) });

      expect(note.content).toBe(content);
    });
  });
});
