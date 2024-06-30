import { DockerBitcoinNetwork } from './DockerBitcoinNetwork';
import { Command } from 'commander';
const figlet = require('figlet');
console.log(figlet.textSync('BitBrew'));

const program = new Command();

program
  .version('0.1.0')
  .description('BitBrew: Craft your own Bitcoin test networks with ease')
  .option('-n, --nodes <number>', 'Number of nodes to brew', '3')
  .option('-s, --stop', 'Stop the brewing process')
  .action(async (options) => {
    const network = new DockerBitcoinNetwork(parseInt(options.nodes));
    if (options.stop) {
      console.log('Cleaning up the brew...');
      await network.stopNetwork();
    } else {
      console.log('Starting to brew your Bitcoin network...');
      await network.startNetwork();
    }
  });

program.parse(process.argv);