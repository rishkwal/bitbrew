import walletController from "../../controllers/walletController.js";

export default async function createAction(name: string, node: string): Promise<void> {
    await walletController.createWallet(name, node);
}