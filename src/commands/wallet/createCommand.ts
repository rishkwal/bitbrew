import { Command } from "commander";
import createAction from "../../actions/wallet/createAction.js";

export const CreateCommand = new Command('create')
    .argument('<name>', 'Name of the wallet')
    .argument('<node>', 'Node to create the wallet on')
    .description('Create a new wallet')
    .action((name, node) => {
        createAction(name, node);
    });