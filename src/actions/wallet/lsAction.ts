import { getWalletController } from "../../controllers/walletController.js";

export default async function LsAction(): Promise<void> {
    const walletController = getWalletController();
    walletController.listWallets();
}