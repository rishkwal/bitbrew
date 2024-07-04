#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import { BrewCommand, 
        CleanCommand, 
        ConnectCommand,
        StopCommand
      } from '../commands';

const program: Command = new Command();

program
  .version('0.1.0')
  .description('BitBrew: Craft your own Bitcoin test networks with ease')
  .action(() => {
    console.log(figlet.textSync('BitBrew',{
      font: 'Doom',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));
    program.outputHelp();
  })
  .hook('preSubcommand', () => {
    console.log('Starting BitBrew...');
  });

program.addCommand(BrewCommand);
program.addCommand(CleanCommand);
program.addCommand(ConnectCommand);
program.addCommand(StopCommand);

program.parse(process.argv);