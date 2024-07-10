import { Command } from "commander";
import attachAction from "../actions/attachAction.js";

export const AttachCommand =  new Command()
    .name("attach")
    .description("Attach to a running node")
    .argument("<node>", "Node to attach to")
    .action(async (nodeName) => {
        await attachAction(nodeName);
    });