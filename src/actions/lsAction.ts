import { getNetworkController } from "../controllers/networkController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function lsAction(): Promise<void> {
    const network = getNetworkController();
    try {
        network.listNodes();
    } catch (err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
    }
}