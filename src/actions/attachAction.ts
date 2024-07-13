import { getNetworkController } from "../controllers/networkController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function attachAction(nodeName: string): Promise<void> {
    const networkController = getNetworkController();
    try {
    await networkController.attachToNode(nodeName);
    } catch (err) {
        clilog.stopSpinner(false);
        if (err instanceof Error) {
            clilog.error(err.message);
        } else {
            clilog.error("An unknown error occurred");
        }
    }
}