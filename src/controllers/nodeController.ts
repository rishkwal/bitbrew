import * as fs from 'fs';
import { NodeConfig, IDockerController, IStateController } from './types.js';
import { clilog } from '../utils/cliLogger.js';

export class NodeController {
  private readonly dockerController: IDockerController;
  private readonly stateController: IStateController;

  constructor(
    dockerController: IDockerController,
    stateController: IStateController,
  ) {
    this.dockerController = dockerController;
    this.stateController = stateController;
  }

  async createNode(node: NodeConfig): Promise<void> {
    if (!fs.existsSync(node.dataDir)) {
      fs.mkdirSync(node.dataDir, { recursive: true });
    }

    const imageName = `rishkwal/bitbrew-bitcoind:27.0-0.1.0-alpha`;
    let images = await this.dockerController.docker.listImages({
      filters: { reference: [imageName] },
    });

    if (images.length === 0) {
      clilog.startSpinner(
        `Image ${imageName} not found, Pulling from registry...`,
      );

      try {
        const stream = await this.dockerController.docker.pull(imageName);

        // Wait for the pull to complete
        await new Promise((resolve, reject) => {
          this.dockerController.docker.modem.followProgress(
            stream,
            (err: Error | null, res: any[] | null) =>
              err ? reject(err) : resolve(res),
          );
        });

        // Verify the image was pulled successfully
        images = await this.dockerController.docker.listImages({
          filters: { reference: [imageName] },
        });

        if (images.length === 0) {
          throw new Error(`Failed to pull image ${imageName}`);
        }

        clilog.stopSpinner(true, `Image ${imageName} pulled successfully.`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('Unknown error pulling image');
        }
      }
    }
    // Check if the container already exists
    try {
      const container = await this.dockerController.getContainer(node.name);
      await container.inspect();
      return;
    } catch (error) {
      // Ignore error and continue creating the container
    }

    await this.dockerController.createContainer({
      Image: imageName,
      Labels: {
        app: 'bitbrew',
      },
      name: node.name,
      NetworkingConfig: {
        EndpointsConfig: {
          bitbrew: {},
        },
      },
      HostConfig: {
        Binds: [
          `${node.dataDir}:/root/.bitcoin`,
          `${this.stateController.getWalletsDir()}:/root/.bitcoin/regtest/wallets`,
        ],
        PortBindings: {
          '18444/tcp': [{ HostPort: node.hostPort.toString() }],
          '18443/tcp': [{ HostPort: node.hostRpcPort.toString() }],
        },
        NetworkMode: 'bitbrew',
      },
    });
    this.stateController.setNodeStatus(node.name, 'stopped');
  }

  async startNode(node: NodeConfig): Promise<void> {
    const container = this.dockerController.getContainer(node.name);
    if ((await container.inspect()).State.Running === true) {
      throw new Error(`Node ${node.name} is already running`);
    }
    try {
      clilog.startSpinner(`Starting node ${node.name}...`);
      await container.start();
      this.stateController.setNodeStatus(node.name, 'running');
      clilog.stopSpinner(true, `Started node ${node.name}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(`Unknown error starting node ${node.name}`);
      }
    }
  }

  async removeNode(node: NodeConfig): Promise<void> {
    const container = this.dockerController.getContainer(node.name);
    try {
      await container.remove({ force: true });
      this.stateController.removeNode(node.name);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(`Unknown error removing node ${node.name}`);
      }
    }
  }

  async stopNode(node: NodeConfig): Promise<void> {
    const container = this.dockerController.getContainer(node.name);
    if ((await container.inspect()).State.Running === false) {
      throw new Error(`Node ${node.name} is already stopped`);
    }
    await container.stop();
    this.stateController.setNodeStatus(node.name, 'stopped');
  }

  async waitForNodeReady(
    node: NodeConfig,
    maxRetries = 30,
    retryInterval = 2000,
  ): Promise<void> {
    clilog.startSpinner(`Waiting for node ${node.name} to be ready...`);
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
          stream.on('data', (chunk: any) => {
            data += chunk.toString();
          });
          stream.on('end', () => resolve(data));
        });
        if (output.includes('"chain": "regtest"')) {
          clilog.stopSpinner(true, `Node ${node.name} is ready`);
          return;
        }
      } catch (error) {
        // Ignore error and continue retrying
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
    throw new Error(`Timeout waiting for node ${node.name} to be ready`);
  }

  async connectNode(sourceNode: NodeConfig, targetNode: NodeConfig) {
    const container = this.dockerController.getContainer(sourceNode.name);
    await container
      .exec({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['bitcoin-cli', 'addnode', targetNode.name, 'add'],
      })
      .then((exec: any) => exec.start({ hijack: true, stdin: true }));
    //TODO: Check if the connection was successful
  }
}
