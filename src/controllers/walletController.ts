import { IDockerController, IStateController, Wallet } from "./types.js";
import { DockerController } from "./dockerController.js";
import { StateController } from "./stateController.js";

class WalletController {
    private docker: IDockerController;
    private stateController: IStateController;
    public wallets: Wallet[] = [];

    constructor(dockerController: IDockerController, stateController: IStateController) {
        this.docker = dockerController
        this.stateController = stateController;
        this.wallets = this.loadWallets();
    }

    private loadWallets() {
        return this.stateController.loadWallets();
    }

    async createWallet(name: string, node: string) {
        console.log('Creating wallet...');
        this.docker.execCommand(node, `bitcoin-cli createwallet ${name}`);
        this.stateController.saveWallet(name, node);
    }

    async listWallets() {
        if(this.wallets.length === 0) {
            console.log('No wallets found');
            return;
        }
        console.table(this.wallets.map((wallet: Wallet) => {
            return {
                name: wallet.name,
                node: wallet.node,
            };
        }));
    }

    async getBalance(walletName: string) {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            console.log(`Wallet ${walletName} not found`);
            return;
        }
        this.docker.execCommand(wallet.node, `bitcoin-cli -rpcwallet=${walletName} getbalances`);
    }

    async transferBitcoin(fromWallet: string, toWallet: string, amount: number) {
        const from = this.wallets.find((wallet) => wallet.name === fromWallet);
        const to = this.wallets.find((wallet) => wallet.name === toWallet);
        if(from === undefined || to === undefined) {
            console.log(`Wallet ${fromWallet} or ${toWallet} not found`);
            return;
        }
        const toAddress = await this.getAddress(toWallet);
        if(toAddress === undefined) {
            console.log('Error getting address');
            return;
        }
        this.docker.execCommand(from.node, `bitcoin-cli -rpcwallet=${fromWallet} sendtoaddress ${toAddress} ${amount}`);
    }

    private async loadWallet(walletName: string) {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            console.log(`Wallet ${walletName} not found`);
            return;
        }
        await this.docker.getExecOutput(wallet.node, `bitcoin-cli -rpcwallet=${walletName} loadwallet ${walletName}`);
    }

    private async getAddress(walletName: string): Promise<string | undefined> {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            console.log(`Wallet ${walletName} not found`);
            return;
        }
        await this.loadWallet(walletName);
        const address = await this.docker.getExecOutput(wallet.node, `bitcoin-cli -rpcwallet=${walletName} getnewaddress`);
        // Remove new line characters
        return address.replace(/(\r\n|\n|\r)/gm, "");
    }

    public async mineBlocks(walletName: string, blocks: number) {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            console.log(`Wallet ${walletName} not found`);
            return;
        }
        const address = await this.getAddress(walletName);
        console.log(address);
        this.docker.execCommand(wallet.node, `bitcoin-cli generatetoaddress ${blocks} ${address}`);
    }
}

export const getWalletController = () => {
    const walletController = new WalletController(new DockerController(), new StateController());
    return walletController;
}