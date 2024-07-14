import { CronJob } from "cron";
import { getWalletController } from "../controllers/walletController.js";

export class Engine {

    private wallets: string[];
    private miner: string;
    //pick the first wallet as the miner
    constructor(wallets: string[]) {
        this.wallets = wallets;
        this.miner = wallets[0]!;
    }

    private async mineInitialBlocks() {
        const walletController = getWalletController();
        await walletController.mineBlocks(this.miner, 101);
        console.log(`Mined 101 blocks to ${this.miner}`);
    }

    private async distributeMinedCoins() {
        const walletController = getWalletController();
        for (let i = 1; i < this.wallets.length; i++) {
            await walletController.transferBitcoin(this.miner, this.wallets[i]!, 50/this.wallets.length);
        }
        console.log("Distributed coins");
    }

    private async mineBlock(miner: string) {
        const walletController = getWalletController();
        await walletController.mineBlocks(miner, 1);
        console.log("Mined a block");
        await this.distributeMinedCoins();
    }

    private async createRandomTransaction(wallets: string[]) {
        // choose random amount between 0.1 and 2
        const amount = Number((Math.random() * (2 - 0.1) + 0.1).toFixed(3));
        const walletController = getWalletController();
        const sender = wallets[Math.floor(Math.random() * wallets.length)];
        const receiver = wallets[Math.floor(Math.random() * wallets.length)];
        await walletController.transferBitcoin(sender!, receiver!, amount);
        console.log(`Transferred ${amount} BTC from ${sender} to ${receiver}`);
    }

    public async run() {
        await this.mineInitialBlocks();
        await this.distributeMinedCoins();
        this.mineBlock(this.miner);
        new CronJob('*/2 * * * * *', () => this.createRandomTransaction(this.wallets)).start();
        new CronJob('*/30 * * * * *', () => this.mineBlock(this.miner)).start();
    }
}