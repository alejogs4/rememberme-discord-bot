import { Client, Message } from 'discord.js';

type ExecuteCommand = (message: Message<boolean>, client: Client<boolean>) => Promise<void>;
export type EventHandler = (message: Message<boolean>) => Promise<void>;

export type Command = {
  command: string;
  execute: ExecuteCommand;
};
