import { NoteContent } from '../../shared/domain/note';
import NoteModel from '../../shared/database/notes.schema';
import { throwDatabaseError } from '../../shared/domain/note.errors';

export function getScheduledNotes(currentDate = new Date()): Promise<Array<NoteContent>> {
  // @ts-ignore
  return NoteModel.find({
    date: {
      $lte: currentDate.getTime(),
    },
  }).catch(throwDatabaseError);
}

export async function saveNote(note: NoteContent): Promise<NoteContent> {
  await NoteModel.insertMany(note).catch(throwDatabaseError);
  return note;
}

export async function removeDueNotes(currentDate = new Date()): Promise<void> {
  // @ts-ignore
  await NoteModel.deleteMany({
    date: {
      $lte: currentDate.getTime(),
    },
  }).catch(throwDatabaseError);
}
