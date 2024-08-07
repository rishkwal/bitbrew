import { Command } from 'commander';
import { execAction } from '../actions/index.js';

export const ExecCommand = new Command('exec')
  .description('Execute a command')
  .argument('<node>', 'container to execute command in')
  .argument('<command>', 'command to execute')
  .action(async (node, command) => {
    await execAction(node, command);
  });
