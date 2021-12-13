import { createMockList } from 'ts-auto-mock';
import { fromNotesToListMessage, MAX_LISTED_NOTE_LENGTH } from './listNotes.mapper';
import { NoteContentWithDifference, TimeMarkWithDifference } from './listNotes.types';
import { sortNotesDifference, sortNotesGapWithDate, WithDateGaps } from './listNotes.sort';

function createString(length: number, character: string = 'a'): string {
  return Array(length).fill(character).join('');
}

describe('Listing logic tests', () => {
  describe('List mappers', () => {
    test('Should list filtering out urls if they exists on the string', () => {
      const str = 'this is a str https://url.com and more';
      const expectedStr = 'this is a str and more';
      const notes = createMockList<NoteContentWithDifference>(2, () => ({ content: str }));

      const resultingMessage = fromNotesToListMessage(notes);

      expect(resultingMessage.includes(`1. ${expectedStr} - this will be reminded in `)).toBe(true);
      expect(resultingMessage.includes(`2. ${expectedStr} - this will be reminded in `)).toBe(true);
    });

    test('Should list without filtering out nothing if not url are present', () => {
      const str = 'this is a str and more without url';
      const notes = createMockList<NoteContentWithDifference>(2, () => ({ content: str }));

      const resultingMessage = fromNotesToListMessage(notes);

      expect(resultingMessage.includes(`1. ${str} - this will be reminded in `)).toBe(true);
      expect(resultingMessage.includes(`2. ${str} - this will be reminded in `)).toBe(true);
    });

    test('Should remove break lines from the content', () => {
      const content = 'this is a str and more' + '\n' + ' content';
      const expectedContent = 'this is a str and more content';
      const notes = createMockList<NoteContentWithDifference>(2, () => ({ content }));

      const resultingMessage = fromNotesToListMessage(notes);

      expect(resultingMessage.includes(expectedContent)).toBe(true);
    });

    test(`Should limit the content to ${MAX_LISTED_NOTE_LENGTH} characters`, () => {
      const letter = 'a';
      const numberOfNotes = 2;
      const longString = createString(50, letter);
      const notes = createMockList<NoteContentWithDifference>(numberOfNotes, () => ({ content: longString }));

      const aCount = fromNotesToListMessage(notes)
        .split('')
        .reduce((count, character) => (character === letter ? count + 1 : count), 0);

      expect(aCount).toBe(numberOfNotes * MAX_LISTED_NOTE_LENGTH);
    });
  });

  describe('Notes sorting functions tests', () => {
    test('Should sort time marks from smallest to greatest (ascending order) since we want to show the greatest available time mark', () => {
      let differences = 6;
      const notes = createMockList<TimeMarkWithDifference>(5, () => ({ difference: --differences })).sort(
        sortNotesDifference,
      );

      let last = -1;
      notes.forEach((note) => {
        expect(note.difference).toBeGreaterThan(last);
        last = note.difference;
      });
    });

    test('Should sort notes from the smallest gap between the note and target date', () => {
      let differences = 6;
      const notes = createMockList<WithDateGaps>(5, () => ({ gapBetweenDates: --differences })).sort(
        sortNotesGapWithDate,
      );

      let last = -1;
      notes.forEach((note) => {
        expect(note.gapBetweenDates).toBeGreaterThan(last);
        last = note.gapBetweenDates;
      });
    });
  });
});
