import { Message } from 'discord.js';
import { NoteProperties } from './remember.usecase';

export function fromMessageToNote(message: Message<boolean>): NoteProperties {
  const [, date, ...note] = message.content.split(' ');

  return {
    user: {
      id: message.author.id,
      username: message.author.username,
    },
    note: {
      content: note.join(' '),
      creationDate: message.createdAt,
      rememberDate: date,
    },
  };
}

const ONE_MS = 1000;
const TIME_MARKS = [
  { mark: 's', ms: ONE_MS },
  { mark: 'm', ms: ONE_MS * 60 },
  { mark: 'h', ms: ONE_MS * 60 * 60 },
  { mark: 'd', ms: ONE_MS * 60 * 60 * 24 },
  { mark: 'w', ms: ONE_MS * 60 * 60 * 24 * 7 },
  { mark: 'M' },
] as const;

type ITimeMarks = typeof TIME_MARKS[number];

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
  const existsTwoNumbers = /^[0-9][0-9]?/g;

  if (foundTimeMark && !existsTwoNumbers.test(rememberDate)) {
    // Throw an error
  }

  if (foundTimeMark && existsTwoNumbers.test(rememberDate)) {
    const [expectedRememberTime] = existsTwoNumbers.exec(rememberDate)!.map(Number);
    return foundTimeMark.mark !== 'M'
      ? new Date(Date.now() + foundTimeMark.ms * expectedRememberTime)
      : sumNToMonth(currentDate, expectedRememberTime);
  }

  // Specific dates
  const sentDateIsValid = isValidDate(rememberDate);
  if (!sentDateIsValid) {
    // Throw error
  }

  // TODO: Support dates in specific hours
  return new Date(rememberDate);
}
