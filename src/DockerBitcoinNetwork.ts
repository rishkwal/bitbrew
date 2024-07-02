import Dockerode from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';

interface NodeConfig {
  name: string;
  port: number;
  rpcPort: number;
  dataDir: string;
}

interface NetworkState {
  nodes: NodeConfig[];
}

export class DockerBitcoinNetwork {
  private nodes: NodeConfig[] = [];
  private docker: Dockerode;
  private readonly stateFile: string;
  private readonly numberOfNodes?: number;

  constructor( numberOfNodes?: number) {
    this.docker = new Dockerode();
    this.stateFile = path.join(process.cwd(), 'network-state.json');
    this.loadState();
  }

  public initializeNodes(numberOfNodes: number) {
    for (let i = 0; i < numberOfNodes; i++) {
      this.nodes.push({
        name: `bitcoin-node-${i}`,
        port: 18444,
        rpcPort: 18443,
        dataDir: path.join(process.cwd(), `nodes/node${i}`),
      });
    }
    this.saveState();
  }

  private saveState() {
    const state: NetworkState = {
      nodes: this.nodes,
    };
    fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
  }
  
  private loadState(): boolean {
    if (fs.existsSync(this.stateFile)) {
      const state: NetworkState = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
      this.nodes = state.nodes;
      return true;
    }
    return false;
  }

  public deleteState() {
    if (fs.existsSync(this.stateFile)) {
      fs.unlinkSync(this.stateFile);
    }
  }

  async startNetwork() {
    console.log('Creating network...');
    await this.createNetwork();
    for (const node of this.nodes) {
      await this.startNode(node);
    }
    for (const node of this.nodes) {
      await this.waitForNodeReady(node);
    }
    await this.connectNodes();
  }

  private async createNetwork() {
    const checkNetwork = await this.docker.listNetworks({ filters: { name: ['bitcoin-regtest'] } });
    if (checkNetwork && checkNetwork.length > 0) {
      console.log('Network already exists.');
      return;
    }
    await this.docker.createNetwork({ Name: 'bitcoin-regtest' });
    console.log('Network created successfully.');
  }

  private async startNode(node: NodeConfig): Promise<void> {
    if (!fs.existsSync(node.dataDir)) {
      fs.mkdirSync(node.dataDir, { recursive: true });
    }

    const imageName = 'bitcoin-regtest:1.0';
    const images = await this.docker.listImages({ filters: { reference: [imageName] } });

    if (images.length === 0) {
      console.log(`Image ${imageName} not found. Pulling from registry...`);
      await new Promise((resolve, reject) => {
        this.docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream) => {
          if (err) {
            reject(err);
          } else if (stream) {
            this.docker.modem.followProgress(stream, (err, res) => {
              if (err) {
                reject(err);
              } else {
                console.log('Image pulled successfully.');
                resolve(res);
              }
            }, (event) => console.log('Pulling image:', event.status));
          } else {
            reject(new Error('Stream is undefined'));
          }
        });
      });
    }

    const container = await this.docker.createContainer({
      Image: imageName,
      name: node.name,
      NetworkingConfig: {
        EndpointsConfig: {
          'bitcoin-regtest': {},
        },
      },
      HostConfig: {
        Binds: [`${node.dataDir}:/home/bitcoin/.bitcoin`],
        NetworkMode: 'bitcoin-regtest',
      },
    });

    try {
      await container.start();
      console.log(`Started node ${node.name} on port ${node.port}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error starting node ${node.name}:`, error.message);
      } else {
        console.error(`Unknown error starting node ${node.name}`);
      }
    }
  }

  private async waitForNodeReady(node: NodeConfig, maxRetries = 30, retryInterval = 2000): Promise<void> {
    console.log(`Waiting for node ${node.name} to be ready...`);
    for (let i = 0; i < maxRetries; i++) {
      try {
        const container = this.docker.getContainer(node.name);
        const exec = await container.exec({
          Cmd: [
            'bitcoin-cli',
            '-regtest',
            `-rpcport=${node.rpcPort}`,
            '-rpcuser=user',
            '-rpcpassword=pass',
            'getblockchaininfo',
          ],
          AttachStdout: true,
          AttachStderr: true,
        });

        const stream = await exec.start({ hijack: true, stdin: true });
        const output = await new Promise<string>((resolve) => {
          let data = '';
          stream.on('data', (chunk) => {
            data += chunk.toString();
          });
          stream.on('end', () => resolve(data));
        });

        if (output.includes('"chain": "regtest"')) {
          console.log(`Node ${node.name} is ready.`);
          return;
        }
      } catch (error) {
        // Ignore errors and continue retrying
      }

      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }

    throw new Error(`Timeout waiting for node ${node.name} to be ready`);
  }

  private async connectNodes() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const sourceNode = this.nodes[i];
        const targetNode = this.nodes[j];

        const container = this.docker.getContainer(sourceNode.name);
        await container.exec({
          Cmd: [
            'bitcoin-cli',
            '-regtest',
            `-rpcport=${sourceNode.rpcPort}`,
            '-rpcuser=user',
            '-rpcpassword=pass',
            'addnode',
            `${targetNode.name}:${targetNode.port}`,
            'add',
          ],
          AttachStdout: true,
          AttachStderr: true,
        }).then((exec) => exec.start({ hijack: true, stdin: true }));

        console.log(`Connected node ${sourceNode.name} to ${targetNode.name}`);
      }
    }
  }

  async stopNetwork() {
    for (const node of this.nodes) {
      const container = this.docker.getContainer(node.name);
      if (!container) {
        console.log(`Node ${node.name} not found`);
        continue;
      }
      
      try {
        await container.remove({ force: true });
        console.log(`Removed container for node ${node.name}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Error removing container for node ${node.name}:`, error.message);
        } else {
          console.error(`Unknown error removing container for node ${node.name}`);
        }
      }
    }
    //delete network
    const network = this.docker.getNetwork('bitcoin-regtest');
    if (!network) {
      console.log('Network not found');
      return;
    }
    try {
      await network.remove();
      console.log('Removed network');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error removing network:', error.message);
      } else {
        console.error('Unknown error removing network');
      }
    }
  }
}

export default DockerBitcoinNetwork;