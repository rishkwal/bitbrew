import { Command } from "commander";
import cleanAction from "../actions/cleanAction.js";

export const CleanCommand = new Command()
    .name('clean')
    .description('Clean up your Bitcoin test network')
    .action(async () => {
        await cleanAction();
    });