import networkController from "../controllers/networkController.js";
import figlet from "figlet";

export default async function brewAction(options: { nodes: number }) {
    console.log(figlet.textSync('BitBrew',{
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }));
    console.log('Brewing your Bitcoin network with', options.nodes, 'nodes...');
    const network = networkController;
    try {
      network.createPaths();
      network.initializeNodes(options.nodes);
      await network.startNetwork();
    } catch (err) {
        if(err instanceof Error)
            console.error(err.message)
        else
            console.error(err);
    }
}