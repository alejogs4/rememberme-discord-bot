import { randomUUID } from 'crypto';
import { NoteContent, NoteProperties } from '../domain/note';
import { fromDateStringToDate } from '../domain/remember.mappers';
import { saveNote } from '../infra/remember.service';

export async function saveRememberNote({ note, user, channelID, guild }: NoteProperties): Promise<NoteContent> {
  const uuid = randomUUID();
  const noteDate = fromDateStringToDate(note.rememberDate);
  const noteToSave: NoteContent = {
    id: uuid,
    content: note.content,
    date: noteDate,
    author: user.username,
    channelID,
    guild,
  };

  return saveNote(noteToSave);
}
