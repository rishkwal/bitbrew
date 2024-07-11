import { IDockerController, IStateController, Wallet } from "./types.js";
import { DockerController } from "./dockerController.js";
import { StateController } from "./stateController.js";

export class WalletController {
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
}

const walletController = new WalletController(new DockerController(), new StateController());
export default walletController;