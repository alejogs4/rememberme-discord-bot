import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInSeconds,
  differenceInMilliseconds,
} from 'date-fns';
import { NoteContent } from '../../shared/domain/note';
import { TIME_MARKS } from '../../shared/domain/notes.constants';
import { sortNotesDifference, sortNotesGapWithDate } from '../domain/listNotes.sort';
import { NoteContentWithDifference, TimeMarkWithDifference, TimeMarkWithSecond } from '../domain/listNotes.types';
import { getAuthorNotesClosestToDate } from '../infra/list.service';

function buildTimeMarkWithDifference(difference: number, mark: TimeMarkWithSecond): TimeMarkWithDifference {
  return {
    mark,
    difference,
  };
}

function getTimeDifferencesByTimeMarks(latterDate: Date | number, earlierDate: Date | number): TimeMarkWithDifference {
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
    .sort(sortNotesDifference)
    .filter(({ difference }) => difference > 0);

  return smallestTimeMark;
}

function getNoteTimeDifferencesWithDate(targetDate: Date) {
  return (note: NoteContent) => {
    const differenceForNote = getTimeDifferencesByTimeMarks(note.date, targetDate);
    return {
      ...note,
      difference: `${differenceForNote.difference}${differenceForNote.mark}`,
      gapBetweenDates: differenceInMilliseconds(note.date, targetDate),
    };
  };
}

export async function getAuthorNotesClosestTo(
  authorID: string,
  targetDate = new Date(),
): Promise<Array<NoteContentWithDifference>> {
  const authorNotes = await getAuthorNotesClosestToDate(authorID);
  const notesWithTimeDifferences = authorNotes.map(getNoteTimeDifferencesWithDate(targetDate));

  return notesWithTimeDifferences.sort(sortNotesGapWithDate);
}
