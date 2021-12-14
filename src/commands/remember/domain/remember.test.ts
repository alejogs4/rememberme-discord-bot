import { BadDateFormat, InvalidDate } from '../../shared/domain/note.errors';
import { fromDateStringToDate } from './remember.mappers';

function differenceIsProper(numberOne: number, numberTwo: number): boolean {
  const errorToleranceRange = 0.0001 * numberOne;
  const lowerLimit = numberOne - errorToleranceRange;
  const upperLimit = numberOne + errorToleranceRange;

  return numberTwo <= upperLimit && numberTwo >= lowerLimit;
}

describe('Remember domain tests', () => {
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
});
