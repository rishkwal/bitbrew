import { Command } from "commander";

export const AttachCommand =  new Command()
    .name("attach")
    .description("Attach to a running node")
    .action(() => {
      console.log("Attaching to node...");
    });