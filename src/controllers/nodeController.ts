import * as fs from 'fs';
import { NodeConfig } from './types.js';
import { DockerController } from './dockerController.js';

export class NodeController {
    private readonly dockerController: DockerController;

    constructor() {
        this.dockerController = new DockerController();
    }

    async createNode(node: NodeConfig): Promise<void> {
        if (!fs.existsSync(node.dataDir)) {
            fs.mkdirSync(node.dataDir, { recursive: true });
        }

        const imageName = `bitcoin-regtest:1.0`;
        const images = await this.dockerController.docker.listImages({ filters: { reference: [imageName] } });

        if (images.length === 0) {
            console.log(`Image ${imageName} not found, Pulling from registry...`)
            await this.dockerController.docker.pull(imageName);
        }
        // Check if the container already exists
        try {
            const container = this.dockerController.getContainer(node.name);
            await container.inspect()
            return;
        } catch (error) {
            // Ignore error and continue creating the container
        } 

        await this.dockerController.createContainer({
            Image: imageName,
            name: node.name,
            NetworkingConfig: {
                EndpointsConfig: {
                    'bitcoin-regtest': {}
                }
            },
            HostConfig: {
                Binds: [`${node.dataDir}:/home/bitcoin/.bitcoin`],
                NetworkMode: 'bitcoin-regtest',
            }
        });
    }

    async startNode(node: NodeConfig): Promise<void> {
        const container = this.dockerController.getContainer(node.name);
        if((await container.inspect()).State.Running === true){
            console.log(`Node ${node.name} is already running`);
            return;
        }
        try {
            await container.start();
            console.log(`Started node ${node.name}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(`Unknown error starting node ${node.name}`);
            }
        }
    }

    async stopNode(node: NodeConfig): Promise<void> {
        const container = this.dockerController.getContainer(node.name);
        if((await container.inspect()).State.Running === false){
            console.log(`Node ${node.name} is already stopped`);
            return;
        }
        await container.stop();
        console.log(`Stopped node ${node.name}`);
    }

    async waitForNodeReady(node: NodeConfig, maxRetries = 30, retryInterval=2000): Promise<void> {
        console.log(`Waiting for node ${node.name} to be ready...`);
        for (let i = 0; i < maxRetries; i++) {
            try {
                const container = this.dockerController.getContainer(node.name);
                const exec = await container.exec({
                    AttachStdout: true,
                    AttachStderr: true,
                    Cmd: ['bitcoin-cli', 'getblockchaininfo'],
                });
                const stream = await exec.start({ hijack: true, stdin: true });
                const output = await new Promise<string>((resolve, reject) => {
                    let data = '';
                    stream.on('data', (chunk) => {
                        data += chunk.toString();
                    });
                    stream.on('end', () => resolve(data));
                });
                if (output.includes('"chain": "regtest"')) {
                    console.log(`Node ${node.name} is ready`);
                    return;
                }
            } catch (error) {
                // Ignore error and continue retrying
            }
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
        throw new Error(`Timeout waiting for node ${node.name} to be ready`)
    }

    async connectNode(sourceNode: NodeConfig, targetNode: NodeConfig) {
        const container = this.dockerController.getContainer(sourceNode.name);
        await container.exec({
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['bitcoin-cli', 'addnode', targetNode.name, 'add'],
        }).then((exec) => exec.start({ hijack: true, stdin: true }));
        //TODO: Check if the connection was successful
        console.log(`Connected ${sourceNode.name} to ${targetNode.name}`);
    }
}