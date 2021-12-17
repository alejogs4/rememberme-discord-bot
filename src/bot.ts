import { createRetryPolicy } from 'promises-fn-utils';
import { Client, Intents } from 'discord.js';
import { startMongoose } from './database/connection';
import { listenIncomingMessages, getBotHandlers } from './initHandlers';
import { scheduleBotOperations } from './commands/remember/infra/remember.cronjob';

export default async function startBot() {
  const applyMongoConnectionRetryPolicy = createRetryPolicy({ retries: 3, retryTime: 5000 });
  const startMongooseWithRetries = applyMongoConnectionRetryPolicy(startMongoose);

  await startMongooseWithRetries();
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  });

  const commandsHandlers = await getBotHandlers();

  client.on('messageCreate', listenIncomingMessages(commandsHandlers));
  scheduleBotOperations(client);

  client.login(process.env.DISCORD_LOGIN_TOKEN);
  return client;
}
