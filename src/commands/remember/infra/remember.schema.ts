import mongoose from '../../../database/connection';
import { NoteContent } from '../domain/note';

const { Schema } = mongoose;

const NoteSchema = new Schema<NoteContent>({
  id: String,
  content: String,
  date: Date,
  author: String,
  authorID: String,
  guild: String,
  channelID: String,
});

export default mongoose.model('Note', NoteSchema);
