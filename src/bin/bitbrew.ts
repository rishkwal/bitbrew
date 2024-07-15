#!/usr/bin/env node --no-warnings
import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
const info = await import('../../package.json', { assert: { type: 'json' } });

import {
  BrewCommand,
  CleanCommand,
  ConnectCommand,
  StopCommand,
  LsCommand,
  StartCommand,
  AddCommand,
  RemoveCommand,
  ExecCommand,
  AttachCommand,
  WalletCommand,
  SendCommand,
  MineCommand,
} from '../commands/index.js';

const program: Command = new Command();
program
  .version(JSON.stringify(info.default.version))
  .description('BitBrew: Craft your own Bitcoin test networks with ease')
  .action(() => {
    program.outputHelp();
  });

program.addHelpText(
  'beforeAll',
  chalk.hex('F2A900')(
    figlet.textSync('BitBrew', {
      font: 'Doom',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    }),
  ),
);
program.addCommand(BrewCommand);
program.addCommand(ConnectCommand);
program.addCommand(LsCommand);
program.addCommand(StartCommand);
program.addCommand(StopCommand);
program.addCommand(AddCommand);
program.addCommand(CleanCommand);
program.addCommand(RemoveCommand);
program.addCommand(ExecCommand);
program.addCommand(AttachCommand);
program.addCommand(WalletCommand);
program.addCommand(SendCommand);
program.addCommand(MineCommand);

program.parse(process.argv);
