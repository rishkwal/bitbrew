import { getWalletController } from "../../controllers/walletController.js";

export default async function BalanceAction(wallet: string): Promise<void> {
    console.log(`Getting balance for wallet: ${wallet}...`);
    const walletController = getWalletController();
    walletController.getBalance(wallet);
}