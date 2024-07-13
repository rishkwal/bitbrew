import { Command } from 'commander';

export const MineCommand = new Command('mine')
    .description('Mine a new block')
    .argument('<wallet>', 'Wallet to receive the mining reward')
    .action((wallet) => {
        console.log(`Mining a new block and sending reward to ${wallet}`);
    }
);

