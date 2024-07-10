import { Command } from 'commander';
import NetworkController from '../controllers/networkController.js';

export const ConnectCommand = new Command()
    .name('connect')
    .description('Connect nodes in the Bitcoin network')
    .argument('<source-node>', 'Source node to connect')
    .argument('<target-node...>', 'Target nodes to connect')
    .action(async (sourceNode, targetNodes) => {
        console.log('Connecting nodes...');
        const network = NetworkController;
        try {
            await network.connectNodes(sourceNode, targetNodes);
        } catch(err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
            return;
        }
        console.log('Nodes connected');
    });