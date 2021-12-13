import { sortField } from './sorting';

type WithNumber = { num: number };

describe('itemsOperations tests', () => {
  describe('Sorting functions tests', () => {
    test('Should sort in ascending order', () => {
      const sortInAscendingOrder = sortField<WithNumber, 'num'>('ASC', 'num');
      const elements = [5, 4, 3, 2, 1].map((num) => ({ num })).sort(sortInAscendingOrder);

      let last = -1;
      elements.forEach(({ num }) => {
        expect(num).toBeGreaterThan(last);
        last = num;
      });
    });

    test('Should sort in descending order', () => {
      const sortInAscendingOrder = sortField<WithNumber, 'num'>('DESC', 'num');
      const elements = [1, 2, 3, 4, 5].map((num) => ({ num })).sort(sortInAscendingOrder);

      let last = 10;
      elements.forEach(({ num }) => {
        expect(num).toBeLessThan(last);
        last = num;
      });
    });
  });
});
