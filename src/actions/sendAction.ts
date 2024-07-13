import { getWalletController } from "../controllers/walletController.js";
import { clilog } from "../utils/cliLogger.js";

export default async function SendAction(from: string, to: string, amount: number){
    if (isNaN(amount)) {
        clilog.error('Amount must be a number');
        process.exit(1);
    }
    const walletController = getWalletController();
    try {
        walletController.transferBitcoin(from, to, Number(amount));
    } catch(err) {
        clilog.stopSpinner(false);
        if(err instanceof Error)
            clilog.error(err.message)
        else
            clilog.error(err as string);
    }
}