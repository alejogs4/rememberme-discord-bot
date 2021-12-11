import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
} from 'date-fns';
import NoteModel from '../../shared/database/notes.schema';
import { throwDatabaseError } from '../../shared/domain/note.errors';
import { ITimeMarks, TIME_MARKS } from '../../shared/domain/notes.constants';
import { NoteContentWithDifference } from '../domain/listNotes.mapper';

type TimeMarkWithSecond = ITimeMarks['mark'] | 's';
type TimeMarkWithDifference = {
  mark: TimeMarkWithSecond;
  difference: number;
};

function buildTimeMarkWithDifference(difference: number, mark: TimeMarkWithSecond): TimeMarkWithDifference {
  return {
    mark,
    difference,
  };
}

function getTimeDifference(latterDate: Date | number, earlierDate: Date | number): TimeMarkWithDifference {
  const differencesPerTimeMark = TIME_MARKS.map((timeMark) => {
    switch (timeMark.mark) {
      case 'm':
        return buildTimeMarkWithDifference(differenceInMinutes(latterDate, earlierDate), timeMark.mark);
      case 'h':
        return buildTimeMarkWithDifference(differenceInHours(latterDate, earlierDate), timeMark.mark);
      case 'd':
        return buildTimeMarkWithDifference(differenceInDays(latterDate, earlierDate), timeMark.mark);
      case 'w':
        return buildTimeMarkWithDifference(differenceInWeeks(latterDate, earlierDate), timeMark.mark);
      case 'M':
        return buildTimeMarkWithDifference(differenceInMonths(latterDate, earlierDate), timeMark.mark);
      default:
        return buildTimeMarkWithDifference(differenceInSeconds(latterDate, earlierDate), 's');
    }
  });
  const [smallestTimeMark] = differencesPerTimeMark
    .sort((differenceA, differenceB) => {
      return differenceA.difference > differenceB.difference ? 1 : -1;
    })
    .filter(({ difference }) => difference > 0);

  return smallestTimeMark;
}

export async function getAuthorNotesClosestToDate(
  authorID: string,
  targetDate: Date = new Date(),
): Promise<Array<NoteContentWithDifference>> {
  const authorNotes = await NoteModel.find({ authorID }).catch(throwDatabaseError);
  // TODO: Move to a use case
  return authorNotes
    .map((note) => {
      const differenceForNote = getTimeDifference(note.date, targetDate);
      return {
        ...note.toObject(),
        difference: `${differenceForNote.difference}${differenceForNote.mark}`,
        diffInMS: differenceInMilliseconds(note.date, targetDate),
      };
    })
    .sort((noteA, noteB) => {
      return noteA.diffInMS > noteB.diffInMS ? 1 : -1;
    });
}
