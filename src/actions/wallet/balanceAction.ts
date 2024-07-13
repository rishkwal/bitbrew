import { getWalletController } from "../../controllers/walletController.js";
import { clilog } from "../../utils/cliLogger.js";

export default async function BalanceAction(wallet: string): Promise<void> {
    const walletController = getWalletController();
    try {
        await walletController.getBalance(wallet);
    } catch(err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
    }
}