import { Message } from 'discord.js';
import { Command } from '../../../types/command';
import { DatabaseError } from '../../shared/domain/note.errors';
import { buildNoSavedNotesMessages, fromNotesToListMessage } from '../domain/listNotes.mapper';
import { getAuthorNotes } from './list.service';

function extractAuthorID(message: Message<boolean>): string {
  return message.author.id;
}

export default {
  command: '-l',
  execute: async (message) => {
    try {
      const authorID = extractAuthorID(message);
      const authorNotes = await getAuthorNotes(authorID);

      if (authorNotes.length === 0) return message.reply({ content: buildNoSavedNotesMessages(authorID) });

      return message.reply({ content: fromNotesToListMessage(authorNotes) });
    } catch (err) {
      if (err instanceof DatabaseError) {
        message.reply({
          content: err.message,
        });
        return;
      }

      message.reply({
        content: 'Error listing your notes',
      });
    }
  },
} as Command;
