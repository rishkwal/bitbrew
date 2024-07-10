import networkController from "../controllers/networkController.js";

export default async function removeAction(node: string) {
    console.log(`Removing node ${node}...`);
    const network = networkController;
    try {
        await network.removeNode(node);
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}