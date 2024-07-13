import { getNetworkController } from "../controllers/networkController.js";

export default async function startAction(nodes: string[], options: {all: boolean}): Promise<void> {
    const network = getNetworkController();
    if (nodes.length === 0) {
        if (options.all) {
            nodes = network.nodes.map(node => node.name);
        } else {
            console.log('Please specify nodes to start');
            return;
        }
    }
    for (const node of nodes) {
        console.log(`Starting node ${node}...`);
        try {
            await network.startNode(node);
        } catch (err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
        }
    }
}

