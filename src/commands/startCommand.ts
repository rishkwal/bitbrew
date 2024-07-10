import { Command } from 'commander';
import startAction from '../actions/startAction.js';

export const StartCommand = new Command()
    .name('start')
    .description('Start nodes in the Bitcoin network')
    .argument('[node...]', 'Nodes to start')
    .option('-a, --all', 'Start all nodes')
    .action( async (nodes) => {
        startAction(nodes, {all: StartCommand.opts().all});
    });
