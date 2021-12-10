import NoteModel from '../../shared/database/notes.schema';
import { NoteContent } from '../../shared/domain/note';
import { throwDatabaseError } from '../../shared/domain/note.errors';

export function getAuthorNotes(authorID: string): Promise<Array<NoteContent>> {
  // @ts-ignore
  return NoteModel.find({
    authorID,
  })
    .sort([['date', -1]])
    .catch(throwDatabaseError);
}
