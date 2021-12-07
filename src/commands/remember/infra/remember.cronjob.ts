import { Client } from 'discord.js';
import cron from 'node-cron';
import { getScheduledNotes, removeDueNotes } from './remember.service';

export function scheduleBotOperations(client: Client<boolean>) {
  cron.schedule('* * * * *', async () => {
    try {
      const savedNotes = await getScheduledNotes();
      for (const note of savedNotes) {
        const { guild, channelID, content, author } = note;
        const messageContent = `
          @${author} you asked to remember you this:
          ${content}
        `;
        const discordGuild = await client.guilds.fetch(guild);
        const channel = await discordGuild.channels.cache.get(channelID);
        if (!channel) continue;
        if (channel.isText()) {
          await channel.send(messageContent);
        }
      }
      return removeDueNotes();
    } catch {}
  });
}
