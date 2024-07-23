import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function execAction(
  node: string,
  command: string,
): Promise<void> {
  try {
    logger.info(`Running exec action on node ${node} with command ${command}`);
    const networkController = getNetworkController();
    networkController.execNodeCommand(node, command);
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) {
      clilog.error(err.message);
    } else {
      clilog.error('An unknown error occurred');
    }
  }
}
