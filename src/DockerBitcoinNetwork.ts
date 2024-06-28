import Dockerode from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';

interface NodeConfig {
  name: string;
  port: number;
  rpcPort: number;
  dataDir: string;
}

export class DockerBitcoinNetwork {
  private nodes: NodeConfig[] = [];
  private docker: Dockerode;

  constructor(private readonly numberOfNodes: number, private readonly basePort: number = 18445) {
    this.docker = new Dockerode();
    this.initializeNodes();
  }

  private initializeNodes() {
    for (let i = 0; i < this.numberOfNodes; i++) {
      this.nodes.push({
        name: `bitcoin-node-${i}`,
        port: this.basePort + i,
        rpcPort: this.basePort + 1000 + i,
        dataDir: path.join('./nodes', process.cwd(), `node${i}`),
      });
    }
  }

  async startNetwork() {
    for (const node of this.nodes) {
      await this.startNode(node);
    }
    await this.connectNodes();
  }

  private async startNode(node: NodeConfig): Promise<void> {
    if (!fs.existsSync(node.dataDir)) {
      fs.mkdirSync(node.dataDir, { recursive: true });
    }

    const imageName = 'ruimarinho/bitcoin-core';
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
      ExposedPorts: {
        [`${node.port}/tcp`]: {},
        [`${node.rpcPort}/tcp`]: {},
      },
      HostConfig: {
        Binds: [`${node.dataDir}:/home/bitcoin/.bitcoin`],
        PortBindings: {
          [`${node.port}/tcp`]: [{ HostPort: `${node.port}` }],
          [`${node.rpcPort}/tcp`]: [{ HostPort: `${node.rpcPort}` }],
        },
      },
      Cmd: [
        'bitcoind',
        '-regtest',
        `-port=${node.port}`,
        `-rpcport=${node.rpcPort}`,
        '-server',
        '-txindex',
        '-rpcuser=user',
        '-rpcpassword=pass',
        '-rpcallowip=0.0.0.0/0',
        '-printtoconsole',
      ],
    });

    await container.start();
    console.log(`Started node ${node.name} on port ${node.port}`);
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
      await container.stop();
      await container.remove();
      console.log(`Stopped and removed node ${node.name}`);
    }
  }
}

export default DockerBitcoinNetwork;