import { getNetworkController } from '../controllers/networkController.js';
import { clilog } from '../utils/cliLogger.js';

export default async function cleanAction(): Promise<void> {
  const network = getNetworkController();
  try {
    await network.cleanNetwork();
  } catch (err) {
    clilog.stopSpinner(false);
    if (err instanceof Error) clilog.error(err.message);
    else clilog.error(err as string);
  }
  clilog.success('Bitcoin network cleaned up');
}
