import { NoteContent } from '../../shared/domain/note';
import { isValidURL } from '../../shared/domain/notes.validators';
import {
  BadDateFormat,
  BAD_DATE_FORMAT_MESSAGE,
  InvalidDate,
  INVALID_DATE_MESSAGE,
} from '../../shared/domain/note.errors';
import { ITimeMarks, TIME_MARKS } from '../../shared/domain/notes.constants';

export function sanitizeNoteContent(content: string): string {
  return content
    .split(' ')
    .map((chunk) => {
      return isValidURL(chunk) ? encodeURI(chunk) : chunk;
    })
    .join(' ');
}

export function buildNoteMessage({ authorID, content }: NoteContent): string {
  return `
<@${authorID}> you asked to remember you this:
${content}
`;
}

function sumNToMonth(currentDate: Date, n: number): Date {
  return new Date(currentDate.setMonth(currentDate.getMonth() + n));
}

function isValidDate(dateStr: string): boolean {
  return !Number.isNaN(Date.parse(dateStr));
}

function findRelativeTimeMark(rememberDate: string) {
  return ({ mark }: ITimeMarks) => rememberDate.endsWith(mark);
}

export function fromDateStringToDate(rememberDate: string, currentDate = new Date()): Date {
  // Relative time
  const foundTimeMark = TIME_MARKS.find(findRelativeTimeMark(rememberDate));
  const existsTwoNumbers = () => /^-?[0-9][0-9]?/g;
  const rememberDateHasNumber = existsTwoNumbers().test(rememberDate);

  if ((foundTimeMark && !rememberDateHasNumber) || (!foundTimeMark && rememberDateHasNumber)) {
    throw new BadDateFormat(BAD_DATE_FORMAT_MESSAGE);
  }

  if (foundTimeMark && rememberDateHasNumber) {
    const [expectedRememberTime] = existsTwoNumbers().exec(rememberDate)!.map(Number);
    if (expectedRememberTime <= 0) {
      throw new InvalidDate(INVALID_DATE_MESSAGE);
    }

    return foundTimeMark.mark !== 'M'
      ? new Date(Date.now() + foundTimeMark.ms * expectedRememberTime)
      : sumNToMonth(currentDate, expectedRememberTime);
  }

  // Specific dates
  const sentDateIsValid = isValidDate(rememberDate);
  if (!sentDateIsValid) {
    throw new BadDateFormat(BAD_DATE_FORMAT_MESSAGE);
  }

  // TODO: Support dates in specific hours
  return new Date(rememberDate);
}
