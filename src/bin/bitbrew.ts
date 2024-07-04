#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import { BrewCommand, CleanCommand, ConnectCommand } from '../commands';

const program = new Command();

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

// program
//   .command('brew')
//   .option('-n, --nodes <number>', 'Number of nodes to brew', '3')
//   .option('-s, --stop', 'Stop the brewing process')
//   .action(async (options) => {
//     const network = new DockerBitcoinNetwork(parseInt(options.nodes));
//     if (options.stop) {
//       console.log('Cleaning up the brew...');
//       await network.stopNetwork();
//     } else {
//       console.log('Starting to brew your Bitcoin network...');
//       await network.startNetwork();
//     }
//   });

program.parse(process.argv);