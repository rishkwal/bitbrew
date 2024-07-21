import { getNetworkController } from '../controllers/networkController.js';
import { getWalletController } from '../controllers/walletController.js';
import figlet from 'figlet';
import chalk from 'chalk';
import { clilog } from '../utils/cliLogger.js';
import { Engine } from '../engine/engine.js';
import { logger } from '../utils/logger.js';

export default async function brewAction(options: {
  nodes: number;
  engine: boolean;
}) {
  console.log(
    chalk.hex('F2A900')(
      figlet.textSync('BitBrew', {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
  logger.info(`running brew action with options: ${JSON.stringify(options)}`);
  clilog.info(`Brewing your Bitcoin network with ${options.nodes} nodes...`);
  const networkController = getNetworkController();
  const walletController = getWalletController();
  try {
    await networkController.createPaths();
    await networkController.initializeNodes(options.nodes);
    await networkController.startNetwork();
    if (options.engine) {
      await networkController.connectAllNodes();
      const wallets = await walletController.createWallets(options.nodes);
      const engine = new Engine(wallets);
      engine.run();
    }
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
