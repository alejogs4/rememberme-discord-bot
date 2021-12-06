import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { listenIncomingMessages } from './initHandlers';

if (process.env.ENV === 'dev') dotenv.config();

(async function startBot() {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  });

  client.on('messageCreate', listenIncomingMessages);
  client.login(process.env.DISCORD_LOGIN_TOKEN);
})();
