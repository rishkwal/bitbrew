import { getNetworkController } from "../controllers/networkController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function connectAction(sourceNode: string, targetNodes: string[]): Promise<void> {
    try {
        const networkController = getNetworkController();
        await networkController.connectNodes(sourceNode, targetNodes);
    } catch(err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
        return;
    }
}