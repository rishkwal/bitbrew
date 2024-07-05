import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";
import figlet from 'figlet';

export const BrewCommand = new Command()
    .name('brew')
    .description('Brew your own Bitcoin test network')
    .option('-n, --nodes <number>', 'Number of nodes to brew', '2')
    .action(async (options) => {
        console.log(figlet.textSync('BitBrew',{
            font: 'Doom',
            horizontalLayout: 'default',
            verticalLayout: 'default'
          }));
        console.log('Brewing your Bitcoin network with', options.nodes, 'nodes...');
        const network = new NetworkController();
        network.initializeNodes(parseInt(options.nodes));
        await network.startNetwork();
    })