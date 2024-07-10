import { Command } from "commander";
import lsAction from "../actions/lsAction.js";

export const LsCommand = new Command()
    .name('ls')
    .description('List your network nodes')
    .action(() => {
        lsAction();
    });