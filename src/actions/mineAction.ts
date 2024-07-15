import { getWalletController } from '../controllers/walletController.js';
import { clilog } from '../utils/cliLogger.js';

export default async function mineAction(wallet: string, number = 1) {
  const walletController = getWalletController();
  try {
    await walletController.mineBlocks(wallet, Number(number));
  } catch (err) {
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
}
