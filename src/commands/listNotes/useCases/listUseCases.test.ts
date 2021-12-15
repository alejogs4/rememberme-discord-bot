import { add, isEqual } from 'date-fns';
import { createMock } from 'ts-auto-mock';
import { NoteContent } from '../../shared/domain/note';
import * as listService from '../infra/list.service';
import { getAuthorNotesClosestTo } from './getAuthorNotes';

jest.mock('../infra/list.service.ts');

afterEach(() => {
  jest.clearAllMocks();
});

describe('list use cases tests', () => {
  test('Should return a list of notes sorted from closest to farthest in time', async () => {
    const currentDate = new Date();
    const firstNote = createMock<NoteContent>({ date: add(currentDate, { minutes: 5 }) });
    const secondNote = createMock<NoteContent>({ date: add(currentDate, { days: 2 }) });
    const thirdNote = createMock<NoteContent>({ date: add(currentDate, { weeks: 3 }) });
    const fourthNote = createMock<NoteContent>({ date: add(currentDate, { months: 1 }) });
    const fifthNote = createMock<NoteContent>({ date: add(currentDate, { seconds: 20 }) });

    const notes = [secondNote, thirdNote, firstNote, fourthNote, fifthNote];
    const expectedNotes = [
      { date: fifthNote.date, timeMark: 's' },
      { date: firstNote.date, timeMark: 'm' },
      { date: secondNote.date, timeMark: 'd' },
      { date: thirdNote.date, timeMark: 'w' },
      { date: fourthNote.date, timeMark: 'M' },
    ];
    // @ts-ignore
    listService.getAuthorNotesClosestToDate.mockResolvedValue(notes);

    const notesWithDifference = await getAuthorNotesClosestTo('author', currentDate);

    expect(notesWithDifference).toHaveLength(notes.length);
    notesWithDifference.forEach((note, index) => {
      const expectedNote = expectedNotes[index];

      expect(isEqual(expectedNote.date, note.date)).toBe(true);
      expect(note.difference.includes(expectedNote.timeMark)).toBe(true);
    });
  });
});
