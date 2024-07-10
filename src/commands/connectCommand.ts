import { Command } from 'commander';
import { connectAction } from '../actions/index.js'

export const ConnectCommand = new Command()
    .name('connect')
    .description('Connect nodes in the Bitcoin network')
    .argument('<source-node>', 'Source node to connect')
    .argument('<target-node...>', 'Target nodes to connect')
    .action(async (sourceNode, targetNodes) => {
        await connectAction(sourceNode, targetNodes);
    });