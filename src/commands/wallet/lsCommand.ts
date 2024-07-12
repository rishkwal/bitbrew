import { Command } from 'commander';

export const LsCommand = new Command('ls')
    .description('List all wallets')
    .action(() => {
        console.log('Listing wallets...');
    });