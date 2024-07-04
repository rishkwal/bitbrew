import { Command } from "commander";

export const StopCommand = new Command()
    .name('stop')
    .description('Stop your Bitcoin test network')
    .action(() => {
        console.log('Stopping your Bitcoin network...');
    });