import { Command } from 'commander';

export const RemoveCommand = new Command()
    .name('remove')
    .description('Remove nodes from your Bitcoin test network')
    .argument('<node>', 'Node to remove')
    .action(async (node) => {
        console.log(`Removing node ${node}...`);
    });