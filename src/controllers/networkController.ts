import { NodeConfig } from './types';
import { StateController } from './stateController.js';
import { DockerController } from './dockerController.js';
import { NodeController } from './nodeController.js';

export class NetworkController {
    private nodes: NodeConfig[] = [];
    private stateController: StateController;
    private dockerController: DockerController;
    private nodeController: NodeController;

    constructor() {
        this.stateController = new StateController();
        this.dockerController = new DockerController();
        this.nodeController = new NodeController();
        this.loadState();
    }

    public initializeNodes(numberOfNodes: number): boolean {
        this.stateController.loadState();
        if(this.nodes.length > 0) {
            console.log('A network already exists. Use `bitbrew start` to start the network.');
            return false;
        }
        for (let i = 0; i < numberOfNodes; i++) {
            this.nodes.push({
                name: `node-${i}`,
                port: 18444,
                rpcPort: 18443,
                dataDir: this.stateController.getNodeDataDir(`node-${i}`),
            });
        }
        this.stateController.saveState(this.nodes);
        return true;
    }

    public createPaths = () => {
        this.stateController.createPaths();
    }

    private loadState(): boolean {
        const loadedNodes = this.stateController.loadState();
        if (loadedNodes) {
            this.nodes = loadedNodes;
            return true;
        }
        return false;
    }

    public deleteState() {
        this.stateController.deleteState();
    }

    public async startNetwork() {
        console.log('Creating network...');
        await this.dockerController.createNetwork('bitcoin-regtest');
        for(const node of this.nodes) {
            await this.nodeController.createNode(node);
            await this.nodeController.startNode(node);
        }
        for (const node of this.nodes) {
            await this.nodeController.waitForNodeReady(node);
        }
    }

    public listNodes(): void{
        if(this.nodes.length === 0) {
            console.log('No nodes found');
            return;
        }
        console.table(this.nodes.map((node: NodeConfig) => {
            return {
                name: node.name,
                port: node.port,
                rpcPort: node.rpcPort,
            };
        }));
    }

    public async connectNodes(sourceNodeName: string, targetNodeNames: string[]) {
        const sourceNode = this.nodes.find((node) => node.name === sourceNodeName);
        if(!sourceNode) {
            throw new Error(`Node ${sourceNodeName} not found`);
        }
        const targetNodes = targetNodeNames.map(name => {
            const node = this.nodes.find((n) => n.name == name);
            if (!node) {
                throw new Error(`Node ${name} not found`);
            }
            return node;
        });
        await this.nodeController.connectNodes(sourceNode, targetNodes);
    }

    async stopNetwork() {
        for (const node of this.nodes) {
            await this.nodeController.stopNode(node);
        }
    }

    async cleanNetwork() {
        for (const node of this.nodes) {
            const container = this.dockerController.getContainer(node.name);
            try {
                await container.remove({ force: true});
                console.log(`Removed container for node ${node.name}`);
            } catch (error: unknown) {
                if(error instanceof Error){
                    console.log(`Error removing container for ${node.name}`);
                } else {
                    console.log(`Unknown error removing container for ${node.name}`);
                }
            }
        }
        await this.dockerController.removeNetwork('bitcoin-regtest');
    }
}

export default NetworkController;