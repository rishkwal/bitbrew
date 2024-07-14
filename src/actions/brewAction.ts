import { getNetworkController } from "../controllers/networkController.js";
import { getWalletController } from "../controllers/walletController.js";
import figlet from "figlet";
import chalk from "chalk";
import { clilog } from "../utils/cliLogger.js";

export default async function brewAction(options: { nodes: number }) {
    console.log(chalk.hex('F2A900')(figlet.textSync('BitBrew',{
      font: 'Doom',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));
    clilog.info(`Brewing your Bitcoin network with ${options.nodes} nodes...`);
    const networkController = getNetworkController();
    const walletController = getWalletController();
    try {
      await networkController.createPaths();
      await networkController.initializeNodes(options.nodes);
      await networkController.startNetwork();
      await walletController.createWallets(options.nodes);
    } catch (err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
    }
}