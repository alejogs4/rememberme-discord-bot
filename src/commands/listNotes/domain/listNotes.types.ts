import { NoteContent } from '../../shared/domain/note';
import { ITimeMarks } from '../../shared/domain/notes.constants';

export type TimeMarkWithSecond = ITimeMarks['mark'] | 's';

export type TimeMarkWithDifference = {
  mark: TimeMarkWithSecond;
  difference: number;
};

export type NoteContentWithDifference = NoteContent & { difference: string };
