import { Command } from 'commander';
import { mineAction } from '../actions/index.js';

export const MineCommand = new Command('mine')
  .description('Mine a new block')
  .argument('<wallet>', 'Wallet to receive the mining reward')
  .argument('[number]', 'Number of blocks to mine')
  .action((wallet, number) => {
    mineAction(wallet, number);
  });
