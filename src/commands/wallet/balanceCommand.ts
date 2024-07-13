import { Command } from "commander";
import balanceAction from "../../actions/wallet/balanceAction.js";

export const BalanceCommand = new Command('balance')
    .argument('<wallet>', 'Name of the wallet')
    .description('Get the balance of a wallet')
    .action((wallet) => {
        balanceAction(wallet);
    });