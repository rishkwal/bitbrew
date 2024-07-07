import { Command } from 'commander';
import { NetworkController } from '../controllers/networkController.js';

export const StartCommand = new Command()
    .name('start')
    .description('Start nodes in the Bitcoin network')
    .argument('[node...]', 'Nodes to start')
    .option('-a, --all', 'Start all nodes')
    .action( async (nodes) => {
        const network = new NetworkController();
        if (nodes.length === 0) {
            if (StartCommand.opts().all) {
                nodes = network.nodes.map(node => node.name);
            } else {
                console.log('Please specify nodes to start');
                return;
            }
        }
        for (const node of nodes) {
            console.log(`Starting node ${node}...`);
            try {
                await network.startNode(node);
            } catch (err) {
                if(err instanceof Error)
                    console.error(err.message)
                else
                    console.error(err);
            }
        }
    });
