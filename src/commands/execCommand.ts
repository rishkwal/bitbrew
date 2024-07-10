import { Command } from "commander";
import NetworkController from "../controllers/networkController.js";

export const ExecCommand = new Command("exec")
  .description("Execute a command")
  .argument("<node>", "container to execute command in")
  .argument("<command>", "command to execute")
  .action(async (node, command) => {
    console.log("executing command");
    const controller = NetworkController;
    try {
      await controller.execNodeCommand(node, command);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
  }});