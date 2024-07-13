import { getNetworkController } from "../controllers/networkController.js";

export default async function stopAction(nodes: string[], options: {all: boolean}) {
    const network = getNetworkController();
    if (options.all) {
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
}