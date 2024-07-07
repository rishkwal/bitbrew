import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";

export const LsCommand = new Command()
    .name('ls')
    .description('List your network nodes')
    .action(() => {
        const network = new NetworkController();
        try {
            network.listNodes();
        } catch (err) {
            if(err instanceof Error)
                console.error(err.message)
            else
                console.error(err);
        }
    });