import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function addAction(name: string) {
  logger.info(`running add action with name: ${name}`);
  const networkController = getNetworkController();
  if (!networkController.exist) {
    clilog.error('Please create a network first using `bitbrew brew` command');
    return;
  }
  try {
    await networkController.addNode(name);
  } catch (err) {
    logger.error(err);
    if (err instanceof Error) console.error(err.message);
    else console.error(err);
  }
}
