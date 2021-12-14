import { Message } from 'discord.js';
import { Command } from '../../shared/types/command';
import { DatabaseError } from '../../shared/domain/note.errors';
import { buildNoSavedNotesMessages, fromNotesToListMessage } from '../domain/listNotes.mapper';
import { getAuthorNotesClosestTo } from '../useCases/getAuthorNotes';

function extractAuthorID(message: Message<boolean>): string {
  return message.author.id;
}

export default {
  command: '-ll',
  execute: async (message) => {
    try {
      const authorID = extractAuthorID(message);
      const authorNotes = await getAuthorNotesClosestTo(authorID, new Date());

      if (authorNotes.length === 0) return message.reply({ content: buildNoSavedNotesMessages(authorID) });

      return message.reply({ content: fromNotesToListMessage(authorNotes) });
    } catch (err) {
      if (err instanceof DatabaseError) {
        return message.reply({
          content: err.message,
        });
      }
      return message.reply({
        content: 'Error listing your notes',
      }) as unknown as Promise<void>;
    }
  },
} as Command;
