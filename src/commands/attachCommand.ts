import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";

export const AttachCommand =  new Command()
    .name("attach")
    .description("Attach to a running node")
    .argument("<node>", "Node to attach to")
    .action((nodeName) => {
        console.log("Attaching to node...");
        const networkController = NetworkController;
        networkController.attachToNode(nodeName);
    });