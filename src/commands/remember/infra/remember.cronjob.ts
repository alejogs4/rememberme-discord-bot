import { createBatchedPromise, createRetryPolicy } from 'promises-fn-utils';
import { Client } from 'discord.js';
import cron from 'node-cron';
import { getScheduledNotes, removeDueNotes } from './remember.service';
import { buildNoteMessage } from '../domain/remember.mappers';

const applySendNoteRetryPolicy = createRetryPolicy({
  retries: 2,
  retryTime: 200,
});

export function scheduleBotOperations(client: Client<boolean>) {
  const fetchChannel = createBatchedPromise(client.channels.fetch);

  cron.schedule('* * * * *', async () => {
    try {
      const savedNotes = await getScheduledNotes();
      const notesToSend = savedNotes.map(async (note) => {
        const messageContent = buildNoteMessage(note);
        const channel = await fetchChannel(note.channelID);

        if (channel && channel.isText()) {
          const sendNote = applySendNoteRetryPolicy(channel.send);
          await sendNote(messageContent);
        }
      });

      await Promise.all(notesToSend);

      return removeDueNotes();
    } catch {}
  });
}
