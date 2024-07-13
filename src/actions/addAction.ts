import { getNetworkController } from "../controllers/networkController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function addAction(name: string) {
    const networkController = getNetworkController();
    if(!networkController.exist) {
        clilog.error('Please create a network first using `bitbrew brew` command');
        return;
    }
    try {
        await networkController.addNode(name);
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}