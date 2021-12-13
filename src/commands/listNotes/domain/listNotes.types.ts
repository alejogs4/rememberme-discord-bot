import { ITimeMarks } from '../../shared/domain/notes.constants';

export type TimeMarkWithSecond = ITimeMarks['mark'] | 's';
export type TimeMarkWithDifference = {
  mark: TimeMarkWithSecond;
  difference: number;
};
