import { getWalletController } from '../../controllers/walletController.js';
import { clilog } from '../../utils/cliLogger.js';
import { logger } from '../../utils/logger.js';

export default async function BalanceAction(wallet: string): Promise<void> {
  logger.info(`Running balance action on wallet ${wallet}`);
  const walletController = getWalletController();
  try {
    await walletController.getBalance(wallet);
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
