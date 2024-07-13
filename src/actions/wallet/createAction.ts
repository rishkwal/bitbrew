import { getWalletController } from "../../controllers/walletController.js";

export default async function createAction(name: string, node: string): Promise<void> {
    const walletController = getWalletController();
    await walletController.createWallet(name, node);
}