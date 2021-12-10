import path from 'path';
import { promisify } from 'util';
import glob from 'glob';
import { Command, ExecuteCommand } from './commands/shared/types/command';

const readFolder = promisify(glob);
const COMMANDS_PATH = path.join(__dirname, 'commands', '**', '*.handler.{ts,js}');

type CommandImport = {
  default: Command;
};

export async function getBotHandlers(): Promise<Array<Command>> {
  const commandsFiles = (await readFolder(COMMANDS_PATH)).filter(Boolean);
  const commandsHandlers = commandsFiles.map<Promise<CommandImport>>((file) => import(file));
  const commandsImports = await Promise.all(commandsHandlers);

  return commandsImports.map((commandImport) => commandImport.default);
}

export function listenIncomingMessages(commands: Array<Command>): ExecuteCommand {
  return async function handleMessage(message) {
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
