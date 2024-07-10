import { Command } from 'commander';
import NetworkController from '../controllers/networkController.js';

export const AddCommand = new Command()
    .name('add')
    .description('Add a new node to your Bitcoin test network')
    .argument('<name>', 'Name of the node to add')
    .action(async (name) => {
        const network = NetworkController;
        if(!network.exist) {
            console.log('Please create a network first using `bitbrew brew` command');
            return;
        }
        console.log(`Adding node ${name}...`);
        try {
            await network.addNode(name);
        } catch (err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
        }
    });