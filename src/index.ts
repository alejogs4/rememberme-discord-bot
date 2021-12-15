import dotenv from 'dotenv';
import { createRetryPolicy } from 'promises-fn-utils';
import { Client, Intents } from 'discord.js';
import { listenIncomingMessages, getBotHandlers } from './initHandlers';
import { scheduleBotOperations } from './commands/remember/infra/remember.cronjob';
import { startMongoose } from './database/connection';

if (process.env.ENV === 'dev') dotenv.config();

const applyMongoConnectionRetryPolicy = createRetryPolicy({ retries: 3, retryTime: 5000 });
const startMongooseWithRetries = applyMongoConnectionRetryPolicy(startMongoose);

(async function startBot() {
  await startMongooseWithRetries();
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  });

  const commandsHandlers = await getBotHandlers();

  client.on('messageCreate', listenIncomingMessages(commandsHandlers));
  scheduleBotOperations(client);

  client.login(process.env.DISCORD_LOGIN_TOKEN);
})();
