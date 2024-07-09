#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import { BrewCommand, 
        CleanCommand, 
        ConnectCommand,
        StopCommand,
        LsCommand,
        StartCommand,
        AddCommand,
        RemoveCommand,
        ExecCommand,
        AttachCommand
      } from '../commands/index.js';

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

program.parse(process.argv);