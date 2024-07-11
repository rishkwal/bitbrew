import { Command } from "commander";

export const CreateCommand = new Command('create')
    .argument('<name>', 'Name of the wallet')
    .argument('<node>', 'Node to create the wallet on')
    .description('Create a new wallet')
    .action(() => {
        console.log('Creating wallet...');
    });