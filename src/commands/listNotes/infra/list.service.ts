import NoteModel from '../../shared/database/notes.schema';
import { NoteContent } from '../../shared/domain/note';
import { throwDatabaseError } from '../../shared/domain/note.errors';

export async function getAuthorNotesClosestToDate(authorID: string): Promise<Array<NoteContent>> {
  const authorNotes = await NoteModel.find({ authorID }).catch(throwDatabaseError);
  return authorNotes.map((note) => note.toObject());
}
