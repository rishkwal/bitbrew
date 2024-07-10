import networkController from "../controllers/networkController.js";

export default async function attachAction(nodeName: string): Promise<void> {
    console.log("Attaching to node...");
    await networkController.attachToNode(nodeName);
}