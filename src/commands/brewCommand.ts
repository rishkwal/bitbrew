import { Command } from "commander";
import { brewAction } from "../actions/index.js";

export const BrewCommand = new Command()
    .name('brew')
    .description('Brew your own Bitcoin test network')
    .option('-n, --nodes <number>', 'Number of nodes to brew', '2')
    .action(async (options) => {
        brewAction({ nodes: options.nodes });
    })