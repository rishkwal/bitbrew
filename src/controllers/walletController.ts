import { IDockerController, IStateController, Wallet } from "./types.js";
import { DockerController } from "./dockerController.js";
import { StateController } from "./stateController.js";
import { clilog } from "../utils/cliLogger.js";

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

    async createWallet(name: string, node: string): Promise<string>{
        clilog.startSpinner(`Creating wallet ${name} on node ${node}...`);
        try{
        await this.docker.getExecOutput(node, `bitcoin-cli createwallet ${name}`);
        await this.stateController.saveWallet(name, node);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unknown error creating wallet');
            }
        }
        clilog.stopSpinner(true, `Wallet ${name} created`);
        return name;
    }

    async createWallets(nodes: number): Promise<string[]> {
        const wallets: string[] = [];
        for (let i = 0; i < nodes; i++) {
            const name = `wallet${i}`;
            const node = `node${i}`;
            await this.createWallet(name, node);
            wallets.push(name);
        }
        return wallets;
    }

    async listWallets() {
        if(this.wallets.length === 0) {
            throw new Error('No wallets found');
        }
        console.table(this.wallets.map((wallet: Wallet) => {
            return {
                name: wallet.name,
                node: wallet.node,
            };
        }));
    }

    async getBalance(walletName: string) {
        clilog.info(`Getting balance for wallet: ${walletName}...`);
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            throw new Error(`Wallet ${walletName} not found`);
        }
        try {
            await this.loadWallet(walletName);
            this.docker.execCommand(wallet.node, `bitcoin-cli -rpcwallet=${walletName} getbalances`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unknown error getting balance');
            }
        }
    }

    async transferBitcoin(fromWallet: string, toWallet: string, amount: number) {
        const from = this.wallets.find((wallet) => wallet.name === fromWallet);
        const to = this.wallets.find((wallet) => wallet.name === toWallet);
        if(from === undefined || to === undefined) {
            throw new Error(`Wallet ${fromWallet} or ${toWallet} not found`);
        }
        const toAddress = await this.getAddress(toWallet);
        if(toAddress === undefined) {
            throw new Error('Error getting address');
        }
        try {
         this.docker.execCommand(from.node, `bitcoin-cli -rpcwallet=${fromWallet} sendtoaddress ${toAddress} ${amount}`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error('Unknown error transferring bitcoin');
            }
        }
    }

    private async loadWallet(walletName: string) {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            throw new Error(`Wallet ${walletName} not found`);
        }
        try {
            await this.docker.getExecOutput(wallet.node, `bitcoin-cli -rpcwallet=${walletName} loadwallet ${walletName}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    }

    private async getAddress(walletName: string): Promise<string | undefined> {
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            throw new Error(`Wallet ${walletName} not found`);
        }
        await this.loadWallet(walletName);
        const address = await this.docker.getExecOutput(wallet.node, `bitcoin-cli -rpcwallet=${walletName} getnewaddress`);
        // Remove new line characters
        return address.replace(/(\r\n|\n|\r)/gm, "");
    }

    public async mineBlocks(walletName: string, blocks: number) {
        clilog.info(`Mining ${blocks} block(s) and sending reward to ${walletName}`);
        const wallet = this.wallets.find((wallet) => wallet.name === walletName);
        if(wallet === undefined) {
            throw new Error(`Wallet ${walletName} not found`);
        }
        try {
        const address = await this.getAddress(walletName);
        await this.docker.execCommand(wallet.node, `bitcoin-cli generatetoaddress ${blocks} ${address}`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            } else {
                throw new Error(`Unknown error mining blocks`);
            }
        }
    }
}

export const getWalletController = () => {
    const walletController = new WalletController(new DockerController(), new StateController());
    return walletController;
}