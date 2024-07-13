import { Command } from 'commander';
import { sendAction } from '../actions/index.js';

export const SendCommand = new Command('send')
    .description('Transfer funds between wallets')
    .argument('<from>', 'Name of the wallet to send funds from')
    .argument('<to>', 'Name of the wallet to send funds to')
    .argument('<amount>', 'Amount to send in bitcoin')
    .action((from, to, amount) => {
        sendAction(from, to, amount);  
    });