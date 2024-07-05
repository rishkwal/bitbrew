import { Command } from "commander";

export const LsCommand = new Command()
    .name('ls')
    .description('List your Bitcoin test network nodes')
    .action(() => {
        console.log('Listing your Bitcoin network nodes...');
    });