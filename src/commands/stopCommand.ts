import { Command } from "commander";
import { NetworkController } from "../controllers/networkController";

export const StopCommand = new Command()
    .name('stop')
    .description('Stop your Bitcoin test network')
    .action(() => {
        const network = new NetworkController();
        network.stopNetwork();
        console.log('Stopping your Bitcoin network...');
    });