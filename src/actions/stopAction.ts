import { getNetworkController } from "../controllers/networkController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function stopAction(nodes: string[], options: {all: boolean}) {
    const network = getNetworkController();
    if (options.all) {
        nodes = network.nodes.map(node => node.name);
    } else if(nodes.length === 0) {
        clilog.error('Please specify nodes to stop');
    }
    for (const node of nodes) {
        try {
            await network.stopNode(node);
        } catch (err) {
            clilog.stopSpinner(false);
            if(err instanceof Error) {
                clilog.error(err.message)
            }
            else
                clilog.error(err as string);
        }
    }
}