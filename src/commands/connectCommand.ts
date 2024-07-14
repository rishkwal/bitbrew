import { Command } from 'commander';
import { connectAction } from '../actions/index.js'

export const ConnectCommand = new Command()
    .name('connect')
    .description('Connect nodes in the Bitcoin network')
    .option('-a, --all', 'Connect all nodes in the network in a linear fashion')
    .argument('[source-node]', 'Source node to connect')
    .argument('[target-node...]', 'Target nodes to connect')
    .action(async (sourceNode, targetNodes, options) => {
        await connectAction(sourceNode, targetNodes, {all: options.all});
    });