import { Command } from 'commander';
import { CreateCommand } from './wallet/createCommand.js';
import { LsCommand } from './wallet/lsCommand.js';
import { BalanceCommand } from './wallet/balanceCommand.js';

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
WalletCommand.addCommand(BalanceCommand);

export { WalletCommand };
