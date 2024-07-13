import { getWalletController } from "../controllers/walletController.js";

export default async function SendAction(from: string, to: string, amount: number){
    if (isNaN(amount)) {
        console.error('Amount must be a number');
        process.exit(1);
    }
    const walletController = getWalletController();
    walletController.transferBitcoin(from, to, Number(amount));
}