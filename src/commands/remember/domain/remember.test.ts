import { fromDateStringToDate } from './remember.mappers';

describe('Remember domain tests', () => {
  test('Should add three minutes to current date', () => {
    const currentDate = new Date();
    const newDate = fromDateStringToDate('3m', currentDate);

    const THREE_MINUTES = 1000 * 60 * 3;
    const threeMinutesDifference = newDate.getTime() - currentDate.getTime();

    expect(threeMinutesDifference).toBe(THREE_MINUTES);
  });

  test('Should add two hours to current date', () => {
    const currentDate = new Date();
    const newDate = fromDateStringToDate('2h', currentDate);

    const TWO_HOURS = 1000 * 60 * 60 * 2;
    const twoHoursDifference = newDate.getTime() - currentDate.getTime();

    expect(twoHoursDifference).toBe(TWO_HOURS);
  });
});
