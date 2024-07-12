import { Command } from "commander";
import { CreateCommand } from './wallet/createCommand.js';
import { LsCommand } from "./wallet/lsCommand.js";

const WalletCommand = new Command('wallet')
    .description('Manage wallets')
    .action(() => {
        console.log('Please specify a sub-command');
        if (process.argv.length === 2) {
            WalletCommand.help();
        }
    });

WalletCommand.addCommand(CreateCommand);
WalletCommand.addCommand(LsCommand);

export { WalletCommand };