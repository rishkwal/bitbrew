import { getWalletController } from "../../controllers/walletController.js";
import { clilog } from "../../utils/cliLogger.js";

export default async function LsAction(): Promise<void> {
    const walletController = getWalletController();
    try {
        walletController.listWallets();
    } catch(err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
    }
}