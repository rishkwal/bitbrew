import { getNetworkController } from "../controllers/networkController.js";

export default async function addAction(name: string) {
    const networkController = getNetworkController();
    if(!networkController.exist) {
        console.log('Please create a network first using `bitbrew brew` command');
        return;
    }
    console.log(`Adding node ${name}...`);
    try {
        await networkController.addNode(name);
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}