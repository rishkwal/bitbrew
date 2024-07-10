import { Command } from 'commander';
import NetworkController from '../controllers/networkController.js';

export const RemoveCommand = new Command()
    .name('remove')
    .description('Remove nodes from your Bitcoin test network')
    .argument('<node>', 'Node to remove')
    .action(async (node) => {
        console.log(`Removing node ${node}...`);
        const network = NetworkController;
        try {
            await network.removeNode(node);
        } catch (err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
        }
    });