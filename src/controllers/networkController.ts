import {
  NetworkState,
  NodeConfig,
  IDockerController,
  IStateController,
  INodeController,
} from './types';
import { StateController } from './stateController.js';
import { DockerController } from './dockerController.js';
import { NodeController } from './nodeController.js';
import { clilog } from '../utils/cliLogger.js';

export class NetworkController {
  public nodes: NodeConfig[] = [];
  public exist: boolean = false;
  private stateController: IStateController;
  private dockerController: IDockerController;
  private nodeController: INodeController;

  constructor(
    StateController: IStateController,
    DockerController: IDockerController,
    NodeController: INodeController,
  ) {
    this.stateController = StateController;
    this.dockerController = DockerController;
    this.nodeController = NodeController;
    this.exist = this.loadState();
  }

  public initializeNodes(numberOfNodes: number): boolean {
    if (this.loadState()) {
      throw new Error(
        'A network already exists. Use `bitbrew start` to start the network.',
      );
    }
    for (let i = 0; i < numberOfNodes; i++) {
      this.nodes.push({
        name: `node${i}`,
        hostPort: 20443 + i,
        hostRpcPort: 21443 + i,
        port: 18444,
        rpcPort: 18443,
        status: 'initialized',
        dataDir: this.stateController.getNodeDataDir(`node${i}`),
      });
    }
    this.stateController.saveState(this.nodes);
    return true;
  }

  public createPaths = () => {
    this.stateController.createPaths();
  };

  private loadState(): boolean {
    const state: NetworkState | null = this.stateController.loadState();
    if (state) {
      this.nodes = state.nodes;
      return true;
    }
    this.nodes = [];
    return false;
  }

  public deleteState() {
    this.stateController.deleteState();
  }

  public async startNetwork() {
    clilog.startSpinner('Creating network...');
    try {
      await this.dockerController.createNetwork('bitbrew');
      clilog.stopSpinner(true, 'Network created');
    } catch {
      throw new Error('Error creating network');
    }
    for (const node of this.nodes) {
      await this.nodeController.createNode(node);
      await this.nodeController.startNode(node);
    }
    for (const node of this.nodes) {
      await this.nodeController.waitForNodeReady(node);
    }
  }

  public listNodes(): void {
    if (this.nodes.length === 0) {
      throw new Error('No nodes found');
    }
    console.table(
      this.nodes.map((node: NodeConfig) => {
        return {
          name: node.name,
          status: node.status,
          port: node.hostPort,
          'RPC port': node.hostRpcPort,
        };
      }),
    );
  }

  public async addNode(nodeName: string) {
    clilog.startSpinner(`Adding node ${nodeName}...`);
    if (this.nodes.find((node) => node.name === nodeName)) {
      clilog.stopSpinner(false, `Node ${nodeName} already exists`);
      return;
    }
    const newNode: NodeConfig = {
      name: nodeName,
      port: 18444,
      rpcPort: 18443,
      hostPort: 20443 + this.nodes.length,
      hostRpcPort: 21443 + this.nodes.length,
      status: 'initialized',
      dataDir: this.stateController.getNodeDataDir(nodeName),
    };
    try {
      await this.nodeController.createNode(newNode);
      this.nodes.push(newNode);
      await this.stateController.saveState(this.nodes);
    } catch {
      clilog.stopSpinner(false, `Error adding node ${nodeName}`);
      throw new Error(`Error adding node ${nodeName}`);
    }
    clilog.stopSpinner(true, `Node ${nodeName} added`);
  }

  public async startNode(nodeName: string) {
    const node = this.nodes.find((node) => node.name === nodeName);
    if (node === undefined) {
      throw new Error(`Node ${nodeName} not found`);
    }
    await this.nodeController.startNode(node);
  }

  public execNodeCommand(nodeName: string, command: string) {
    const node = this.nodes.find((node) => node.name === nodeName);
    if (node === undefined) {
      throw new Error(`Node ${nodeName} not found`);
    }
    command = 'bitcoin-cli ' + command;
    this.dockerController.execCommand(nodeName, command);
  }

  public async attachToNode(nodeName: string) {
    clilog.startSpinner(`Attaching to node ${nodeName}...`);
    const node = this.nodes.find((node) => node.name === nodeName);
    if (node === undefined) {
      throw new Error(`Node ${nodeName} not found`);
    }
    try {
      this.dockerController.attachToContainer(node.name);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(`Error attaching to node ${nodeName}`);
    }
    clilog.stopSpinner(true, `Attached to node ${nodeName}`);
  }

  public async stopNode(nodeName: string) {
    clilog.startSpinner(`Stopping node ${nodeName}...`);
    const node = this.nodes.find((node) => node.name === nodeName);
    if (node === undefined) {
      clilog.stopSpinner(false, `Node ${nodeName} not found`);
      return;
    }
    try {
      await this.nodeController.stopNode(node);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(`Error stopping node ${nodeName}`);
    }
    clilog.stopSpinner(true, `Node ${nodeName} stopped`);
  }

  public async removeNode(nodeName: string) {
    clilog.startSpinner(`Removing node ${nodeName}...`);
    const node = this.nodes.find((node) => node.name === nodeName);
    if (node === undefined) {
      throw new Error(`Node ${nodeName} not found`);
    }
    try {
      await this.nodeController.removeNode(node);
      this.nodes = this.nodes.filter((node) => node.name !== nodeName);
      this.stateController.saveState(this.nodes);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error(`Error removing node ${nodeName}`);
    }
    clilog.stopSpinner(true, `Node ${nodeName} removed`);
  }

  public async connectNodes(sourceNodeName: string, targetNodeNames: string[]) {
    const sourceNode = this.nodes.find((node) => node.name === sourceNodeName);
    if (!sourceNode) {
      throw new Error(`Node ${sourceNodeName} not found`);
    }
    const targetNodes = targetNodeNames.map((name) => {
      const node = this.nodes.find((n) => n.name == name);
      if (!node) {
        throw new Error(`Node ${name} not found`);
      }
      return node;
    });
    for (const targetNode of targetNodes) {
      clilog.startSpinner(
        `Connecting nodes ${sourceNode.name} and ${targetNode.name}...`,
      );
      await this.nodeController.connectNode(sourceNode, targetNode);
      clilog.stopSpinner(
        true,
        `Connected ${sourceNode.name} to ${targetNode.name}`,
      );
    }
  }

  // connect all nodes in a linear fashion
  public async connectAllNodes() {
    clilog.info('Connecting all nodes...');
    if (this.nodes.length < 2) {
      throw new Error('At least two nodes are required to connect all nodes');
    }
    try {
      for (let i = 0; i < this.nodes.length - 1; i++) {
        const sourceNode: string = this.nodes[i]!.name!;
        const targetNode: string[] = [
          this.nodes[(i + 1) % this.nodes.length]!.name,
        ];
        await this.connectNodes(sourceNode, targetNode);
      }
    } catch (err) {
      throw new Error('Error connecting nodes');
    }
  }

  async cleanNetwork() {
    clilog.info('Cleaning up your Bitcoin network...');
    for (const node of this.nodes) {
      const container = this.dockerController.getContainer(node.name);
      try {
        clilog.startSpinner(`Removing node ${node.name}...`);
        try {
          await container.inspect();
          await container.remove({ force: true });
        } catch {
          // Ignore error as container does not exist
        }
        clilog.stopSpinner(true, `Removed node ${node.name}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error removing container for ${node.name}`);
        } else {
          throw new Error(`Unknown error removing container for ${node.name}`);
        }
      }
    }
    try {
      clilog.startSpinner('Removing network...');
      await this.dockerController.removeNetwork('bitbrew');
      clilog.stopSpinner(true, 'Network removed successfully');
    } catch {
      throw new Error('Error removing network');
    }
    try {
      clilog.startSpinner('Deleting data...');
      this.stateController.deleteAllData();
      clilog.stopSpinner(true, 'Data deleted successfully');
    } catch {
      throw new Error('Error deleting data');
    }
  }
}

export const getNetworkController = () => {
  const stateController = new StateController();
  const dockerController = new DockerController();
  const nodeController = new NodeController(dockerController, stateController);
  return new NetworkController(
    stateController,
    dockerController,
    nodeController,
  );
};
