import networkController from "../controllers/networkController.js";

export default async function lsAction(): Promise<void> {
    const network = networkController;
    try {
        network.listNodes();
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}