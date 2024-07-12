import { Command } from 'commander';

export const SendCommand = new Command('send')
    .description('Transfer funds between wallets')
    .argument('<from>', 'Name of the wallet to send funds from')
    .argument('<to>', 'Name of the wallet to send funds to')
    .argument('<amount>', 'Amount to send in bitcoin')
    .action((from, to, amount) => {
        if (isNaN(amount)) {
            console.error('Amount must be a number');
            process.exit(1);
        }
        console.log(`Sending ${amount} bitcoin from ${from} to ${to}`);
    });