import { Command } from 'commander';
import { addAction } from '../actions/index.js';

export const AddCommand = new Command()
  .name('add')
  .description('Add a new node to your Bitcoin test network')
  .argument('<name>', 'Name of the node to add')
  .action(async (name) => {
    await addAction(name);
  });
