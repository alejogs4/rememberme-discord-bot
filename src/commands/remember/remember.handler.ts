import { Command } from '../../types/command';

export default {
  command: '-rr',
  async execute() {
    console.log('Remember me');
  },
} as Command;
