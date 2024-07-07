import { Command } from 'commander';
import { NetworkController } from '../controllers/networkController.js';

export const StartCommand = new Command()
    .name('start')
    .description('Start nodes in the Bitcoin network')
    .argument('<node...>', 'Nodes to start')
    .action( async (nodes) => {
        const network = new NetworkController();
        for (const node of nodes) {
            console.log(`Starting node ${node}...`);
            await network.startNode(node);
        }
    });
