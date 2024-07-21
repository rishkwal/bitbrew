import { getWalletController } from '../../controllers/walletController.js';
import { clilog } from '../../utils/cliLogger.js';
import { logger } from '../../utils/logger.js';

export default async function LsAction(): Promise<void> {
  logger.info('Running ls action');
  const walletController = getWalletController();
  try {
    walletController.listWallets();
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
