import { Command } from "commander";
import stopAction from "../actions/stopAction.js";

export const StopCommand = new Command()
    .name('stop')
    .description('Stop your Bitcoin test network')
    .argument('[node...]', 'Nodes to stop')
    .option('-a, --all', 'Stop all nodes')
    .action(async (nodes) => {
        stopAction(nodes, {all: StopCommand.opts().all});
    });