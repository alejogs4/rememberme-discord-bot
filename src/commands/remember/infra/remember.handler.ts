import { Message } from 'discord.js';
import { Command } from '../../../types/command';
import { BadDateFormat, fromMessageToNote } from '../domain/remember.mappers';
import { saveRememberNote } from '../useCases/remember.usecase';

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
      if (err instanceof BadDateFormat) {
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
