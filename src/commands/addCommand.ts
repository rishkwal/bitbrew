import { Command } from 'commander';

export const AddCommand = new Command()
    .name('add')
    .description('Add a new node to your Bitcoin test network')
    .argument('<name>', 'Name of the node to add')
    .action(async (name) => {
        console.log(`Adding node ${name}...`);
    });