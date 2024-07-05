import { Command } from "commander";
import NetworkController from "../controllers/networkController";

export const CleanCommand = new Command()
    .name('clean')
    .description('Clean up your Bitcoin test network')
    .action(async () => {
        console.log('Cleaning up your Bitcoin network...');
        const network = new NetworkController();
        await network.cleanNetwork();
        network.deleteState();
        console.log('Bitcoin network cleaned up');
    });