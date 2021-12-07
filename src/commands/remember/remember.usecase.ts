import { fromDateStringToDate } from './remember.mappers';

export type NoteProperties = {
  user: {
    id: string;
    username: string;
  };
  note: {
    rememberDate: string;
    content: string;
    creationDate: Date;
  };
};

export type NoteContent = {
  username: NoteProperties['user']['username'];
  date: Date;
  content: NoteProperties['note']['content'];
};

export async function saveRememberNote({ note, user }: NoteProperties): Promise<NoteContent> {
  const noteDate = fromDateStringToDate(note.rememberDate);

  return {
    content: note.content,
    date: noteDate,
    username: user.username,
  };
}
