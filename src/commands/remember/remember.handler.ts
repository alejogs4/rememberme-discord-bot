import { Message } from 'discord.js';
import { Command } from '../../types/command';
import { fromMessageToNote } from './remember.mappers';
import { saveRememberNote } from './remember.usecase';

export default {
  command: '-rr',
  async execute(message: Message<boolean>) {
    try {
      const note = fromMessageToNote(message);
      const savedNote = await saveRememberNote(note);
    } catch (err) {
      message.reply({
        content: 'Error saving note',
      });
    }
  },
} as Command;
