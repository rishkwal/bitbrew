import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";

export const LsCommand = new Command()
    .name('ls')
    .description('List your network nodes')
    .action(() => {
        const network = new NetworkController();
        network.listNodes();
    });