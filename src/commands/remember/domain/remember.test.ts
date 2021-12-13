import { fromDateStringToDate } from './remember.mappers';

describe('Remember domain tests', () => {
  test('Should add three minutes to current date', () => {
    const currentDate = new Date();
    const newDate = fromDateStringToDate('3m', currentDate);

    const threeMinutes = 1000 * 60 * 3;
    const threeMinutesDifference = newDate.getTime() - currentDate.getTime();

    expect(threeMinutesDifference).toBe(threeMinutes);
  });

  test('Should add two hours to current date', () => {
    const currentDate = new Date();
    const newDate = fromDateStringToDate('2h', currentDate);

    const twoHours = 1000 * 60 * 60 * 2;
    const twoHoursDifference = newDate.getTime() - currentDate.getTime();

    expect(twoHoursDifference).toBe(twoHours);
  });
});
