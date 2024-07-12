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
}

export const getWalletController = () => {
    const walletController = new WalletController(new DockerController(), new StateController());
    return walletController;
}