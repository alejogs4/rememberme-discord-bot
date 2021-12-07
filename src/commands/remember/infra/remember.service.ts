import { NoteContent } from '../domain/note';
import NoteModel from './remember.schema';

export function getScheduledNotes(currentDate = new Date()): Promise<Array<NoteContent>> {
  // @ts-ignore
  return NoteModel.find({
    date: {
      $lte: currentDate.getTime(),
    },
  });
}

export async function saveNote(note: NoteContent): Promise<NoteContent> {
  await NoteModel.insertMany(note);
  return note;
}

export async function removeDueNotes(currentDate = new Date()): Promise<void> {
  // @ts-ignore
  await NoteModel.deleteMany({
    date: {
      $lte: currentDate.getTime(),
    },
  });
}
