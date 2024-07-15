import { Command } from 'commander';
import { removeAction } from '../actions/index.js';

export const RemoveCommand = new Command()
  .name('remove')
  .description('Remove nodes from your Bitcoin test network')
  .argument('<node>', 'Node to remove')
  .action(async (node) => {
    removeAction(node);
  });
