import { getWalletController } from '../../controllers/walletController.js';
import { clilog } from '../../utils/cliLogger.js';
import { logger } from '../../utils/logger.js';

export default async function createAction(
  name: string,
  node: string,
): Promise<void> {
  logger.info('Running create action');
  const walletController = getWalletController();
  try {
    await walletController.createWallet(name, node);
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
