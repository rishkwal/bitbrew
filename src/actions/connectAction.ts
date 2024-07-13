import { getNetworkController } from "../controllers/networkController.js";

export default async function connectAction(sourceNode: string, targetNodes: string[]): Promise<void> {
    console.log('Connecting nodes...');
    try {
        const networkController = getNetworkController();
        await networkController.connectNodes(sourceNode, targetNodes);
    } catch(err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
        return;
    }
    console.log('Nodes connected');
}