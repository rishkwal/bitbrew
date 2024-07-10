import networkController from "../controllers/networkController.js";

export default async function addAction(name: string) {
    const network = networkController;
    if(!network.exist) {
        console.log('Please create a network first using `bitbrew brew` command');
        return;
    }
    console.log(`Adding node ${name}...`);
    try {
        await network.addNode(name);
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}