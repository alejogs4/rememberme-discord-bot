export type NoteProperties = {
  guild: string;
  channelID: string;
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
  id: string;
  author: NoteProperties['user']['username'];
  authorID: NoteProperties['user']['id'];
  date: Date;
  content: NoteProperties['note']['content'];
  guild: string;
  channelID: string;
};
