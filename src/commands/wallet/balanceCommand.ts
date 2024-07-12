import { Command } from "commander";

export const BalanceCommand = new Command('balance')
    .argument('<wallet>', 'Name of the wallet')
    .description('Get the balance of a wallet')
    .action((wallet) => {
        console.log(`Getting balance for wallet: ${wallet}`);
    });