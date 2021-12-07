import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { listenIncomingMessages, getBotHandlers } from './initHandlers';
import { scheduleBotOperations } from './commands/remember/infra/remember.cronjob';

if (process.env.ENV === 'dev') dotenv.config();

(async function startBot() {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  });

  const commandsHandlers = await getBotHandlers();

  client.on('messageCreate', listenIncomingMessages(commandsHandlers));
  scheduleBotOperations(client);

  client.login(process.env.DISCORD_LOGIN_TOKEN);
})();
