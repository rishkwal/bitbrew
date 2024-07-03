import { Command } from 'commander';
import DockerBitcoinNetwork from '../DockerBitcoinNetwork';

export const ConnectCommand = new Command()
    .name('connect')
    .description('Connect nodes in the Bitcoin network')
    .argument('<source-node>', 'Source node to connect')
    .argument('<target-node...>', 'Target nodes to connect')
    .action(async (sourceNode, targetNodes) => {
        console.log('Connecting nodes...');
        const network = new DockerBitcoinNetwork();
        await network.connectNodes(sourceNode, targetNodes);
        console.log('Nodes connected');
    });