import { Client } from 'discord.js';
import cron from 'node-cron';
import { getScheduledNotes, removeDueNotes } from './remember.service';
import { buildNoteMessage } from '../domain/remember.mappers';

export function scheduleBotOperations(client: Client<boolean>) {
  cron.schedule('* * * * *', async () => {
    try {
      const savedNotes = await getScheduledNotes();
      const notesToSend = savedNotes.map(async (note) => {
        const messageContent = buildNoteMessage(note);

        const guild = await client.guilds.fetch(note.guild);
        const channel = guild.channels.cache.get(note.channelID);

        if (channel && channel.isText()) {
          await channel.send(messageContent);
        }
      });

      await Promise.all(notesToSend);

      return removeDueNotes();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  });
}
