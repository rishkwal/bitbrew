import { getWalletController } from '../controllers/walletController.js';
import { clilog } from '../utils/cliLogger.js';
import { logger } from '../utils/logger.js';

export default async function SendAction(
  from: string,
  to: string,
  amount: number,
) {
  logger.info(`Running send action from ${from} to ${to}`);
  if (isNaN(amount)) {
    clilog.error('Amount must be a number');
    process.exit(1);
  }
  const walletController = getWalletController();
  try {
    walletController.transferBitcoin(from, to, Number(amount));
  } catch (err) {
    logger.error(err);
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
