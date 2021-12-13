import { isValidURL } from '../../shared/domain/notes.validators';
import { NoteContentWithDifference } from './listNotes.types';

export const MAX_LISTED_NOTE_LENGTH = 40;

function filterOutUrls(content: string): string {
  return content
    .split(' ')
    .filter((chunk) => !isValidURL(chunk))
    .join(' ');
}

export function fromNotesToListMessage(notes: Array<NoteContentWithDifference>): string {
  return notes
    .map((note) => {
      return {
        ...note,
        content: filterOutUrls(note.content).replace(/\n/g, '').substring(0, MAX_LISTED_NOTE_LENGTH),
      };
    })
    .reduce((noteList, note, index) => {
      return noteList + `${index + 1}. ${note.content}` + ` - this will be reminded in ${note.difference}` + '\n';
    }, '');
}

export function buildNoSavedNotesMessages(authorID: string): string {
  return `Hello <@${authorID}>, you don't currently have scheduled notes`;
}
