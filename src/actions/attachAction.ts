import { getNetworkController } from "../controllers/networkController.js";

export default async function attachAction(nodeName: string): Promise<void> {
    console.log("Attaching to node...");
    const networkController = getNetworkController();
    await networkController.attachToNode(nodeName);
}