import { Command } from 'commander';

export const StartCommand = new Command()
    .name('start')
    .description('Start nodes in the Bitcoin network')
    .argument('[node...]', 'Nodes to start')
    .action(() => {
        console.log(`Starting node`);
    });
