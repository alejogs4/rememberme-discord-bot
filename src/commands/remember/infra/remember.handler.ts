import { Message } from 'discord.js';
import { Command } from '../../shared/types/command';
import { NoteProperties } from '../../shared/domain/note';
import { BadDateFormat, DatabaseError } from '../../shared/domain/note.errors';
import { saveRememberNote } from '../useCases/remember.usecase';

function fromMessageToNote(message: Message<boolean>): NoteProperties {
  const [, date, ...note] = message.content.trim().split(' ');

  return {
    guild: String(message.guild?.id),
    channelID: message.channel.id,
    user: {
      id: message.author.id,
      username: message.author.username,
    },
    note: {
      content: note.join(' '),
      creationDate: message.createdAt,
      rememberDate: date,
    },
  };
}

export default {
  command: '-rr',
  async execute(message: Message<boolean>) {
    try {
      const note = fromMessageToNote(message);
      const savedNote = await saveRememberNote(note);

      return message.reply({
        content: `Message with ID: ${savedNote.id} was published`,
      });
    } catch (err) {
      if (err instanceof BadDateFormat || err instanceof DatabaseError) {
        message.reply({
          content: err.message,
        });
        return;
      }

      message.reply({
        content: 'Error saving note',
      });
    }
  },
} as Command;
