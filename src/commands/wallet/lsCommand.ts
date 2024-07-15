import { Command } from 'commander';
import LsAction from '../../actions/wallet/lsAction.js';

export const LsCommand = new Command('ls')
  .description('List all wallets')
  .action(() => {
    LsAction();
  });
