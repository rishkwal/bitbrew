import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function lsAction(): Promise<void> {
  logger.info('Running ls action');
  const network = getNetworkController();
  try {
    network.listNodes();
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
