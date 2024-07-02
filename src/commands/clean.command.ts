import { Command } from "commander";
import DockerBitcoinNetwork from "../DockerBitcoinNetwork";

export const CleanCommand = new Command()
    .name('clean')
    .description('Clean up your Bitcoin test network')
    .action(async () => {
        console.log('Cleaning up your Bitcoin network...');
        const network = new DockerBitcoinNetwork();
        await network.stopNetwork();
        network.deleteState();
        console.log('Bitcoin network cleaned up');
    });