import networkController from "../controllers/networkController.js";

export default async function cleanAction(): Promise<void> {
    console.log('Cleaning up your Bitcoin network...');
    const network = networkController;
    try {
        await network.cleanNetwork();
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
    network.deleteState();
    console.log('Bitcoin network cleaned up');
}