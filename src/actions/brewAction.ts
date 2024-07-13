import { getNetworkController } from "../controllers/networkController.js";
import figlet from "figlet";
import chalk from "chalk";
import { clilog } from "../utils/cliLogger.js";

export default async function brewAction(options: { nodes: number }) {
    console.log(chalk.hex('F2A900')(figlet.textSync('BitBrew',{
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));
    clilog.info(`Brewing your Bitcoin network with ${options.nodes} nodes...`);
    const network = getNetworkController();
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