import { Message, MessageEmbed } from 'discord.js';
import { commandsDescription } from '../../shared/domain/usersHelp.docs';
import { Command } from '../../shared/types/command';

export default {
  command: '-h',
  execute(message) {
    const documentationEmbeds = commandsDescription.map((command) => {
      return new MessageEmbed().setTitle(command.title).setColor('#DAF7A6').setDescription(command.description);
    });

    return message.reply({
      embeds: documentationEmbeds,
    }) as unknown as Promise<void>;
  },
} as Command;
