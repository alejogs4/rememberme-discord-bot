import { add, isValid } from 'date-fns';
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

function findRelativeTimeMark(rememberDate: string) {
  return ({ mark }: ITimeMarks) => rememberDate.endsWith(mark);
}

function countNumbersAreTheBeginning(str: string): number {
  const splitted = str.split('');
  let count = 0;

  for (let character of splitted) {
    if (Number.isNaN(parseInt(character))) return count;
    count++;
  }
  return count;
}

function gatherNumberAtTheBeginning(str: string): number {
  const splitted = str.split('');
  let futureNum = '';

  for (let character of splitted) {
    if (Number.isNaN(parseInt(character))) return Number(futureNum);
    futureNum += character;
  }
  return Number(futureNum);
}

export function fromDateStringToDate(rememberDate: string, currentDate = new Date()): Date {
  if (rememberDate[0] === '-') throw new InvalidDate(INVALID_DATE_MESSAGE);

  // Relative time
  const foundTimeMark = TIME_MARKS.find(findRelativeTimeMark(rememberDate));
  const numberAtTheBeginning = countNumbersAreTheBeginning(rememberDate);

  const isInvalidWithTimeMark =
    numberAtTheBeginning === 0 ||
    (numberAtTheBeginning >= 4 && foundTimeMark) ||
    (numberAtTheBeginning <= 3 && !foundTimeMark);

  if (isInvalidWithTimeMark) throw new BadDateFormat(BAD_DATE_FORMAT_MESSAGE);
  if (foundTimeMark) {
    const expectedRememberTime = gatherNumberAtTheBeginning(rememberDate);

    return foundTimeMark.mark !== 'M'
      ? new Date(Date.now() + foundTimeMark.ms * expectedRememberTime)
      : add(currentDate, { months: expectedRememberTime });
  }

  const sentDateIsValid = isValid(new Date(rememberDate));
  // Specific dates
  if (!sentDateIsValid) throw new BadDateFormat(BAD_DATE_FORMAT_MESSAGE);

  // TODO: Support dates in specific hours
  return new Date(rememberDate);
}
