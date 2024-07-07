import { Command } from "commander";
import { NetworkController } from "../controllers/networkController.js";

export const StopCommand = new Command()
    .name('stop')
    .description('Stop your Bitcoin test network')
    .argument('[node...]', 'Nodes to stop')
    .option('-a, --all', 'Stop all nodes')
    .action(async (nodes) => {
        const network = new NetworkController();
        if (StopCommand.opts().all) {
            nodes = network.nodes.map(node => node.name);
        } else {
            console.log('Please specify nodes to stop');
        }
        for (const node of nodes) {
            console.log(`Stopping node ${node}...`);
            try {
                await network.stopNode(node);
            } catch (err) {
                if(err instanceof Error)
                    console.error(err.message)
                else
                    console.error(err);
            }
        }
    });