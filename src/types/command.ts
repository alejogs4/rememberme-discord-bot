import { Message } from 'discord.js';

export type ExecuteCommand = (message: Message<boolean>) => Promise<void>;

export type Command = {
  command: string;
  execute: ExecuteCommand;
};
