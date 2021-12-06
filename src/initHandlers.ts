import { Message } from 'discord.js';

type ExecuteCommand = (message: Message<boolean>) => Promise<void>;

export type Command = {
  command: string;
  execute: ExecuteCommand;
};

export function getBotHandlers() {}

export function listenIncomingMessages(commands: Array<Command>): ExecuteCommand {
  return async (message) => {
    if (!message.content.startsWith('-')) return;

    const [sentCommand] = message.content.split(' ');
    const selectedCommand = commands.find(({ command }) => command === sentCommand.toLowerCase());
    if (!selectedCommand) return;

    try {
      await selectedCommand.execute(message);
    } catch (err) {
      console.log(err);
    }
  };
}
