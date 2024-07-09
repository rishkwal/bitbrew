import { Command } from "commander";

export const ExecCommand = new Command("exec")
  .description("Execute a command")
  .argument("<node>", "container to execute command in")
  .argument("<command>", "command to execute")
  .action(async (node, command) => {
    console.log("executing command");
  });