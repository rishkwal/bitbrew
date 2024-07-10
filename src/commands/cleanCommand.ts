import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";

export const CleanCommand = new Command()
    .name('clean')
    .description('Clean up your Bitcoin test network')
    .action(async () => {
        console.log('Cleaning up your Bitcoin network...');
        const network = NetworkController;
        try {
            await network.cleanNetwork();
        } catch (err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
        }
        network.deleteState();
        console.log('Bitcoin network cleaned up');
    });