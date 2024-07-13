import { getWalletController } from "../controllers/walletController.js";

export default async function mineAction(wallet: string, number=1) {
    console.log(`Mining a new block and sending reward to ${wallet}`);
    const walletController = getWalletController();
    walletController.mineBlocks(wallet, Number(number));
}