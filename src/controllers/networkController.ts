import { NetworkState, NodeConfig } from './types';
import { StateController } from './stateController.js';
import { DockerController } from './dockerController.js';
import { NodeController } from './nodeController.js';

export class NetworkController {
    public nodes: NodeConfig[] = [];
    public exist: boolean = false;
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
                status: 'initialized',
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
        const state: NetworkState | null = this.stateController.loadState();
        if (state) {
            this.nodes = state.nodes;
            this.exist = state.exist;
            return true;
        }
        return false;
    }

    public deleteState() {
        this.stateController.deleteState();
    }

    public async startNetwork() {
        console.log('Creating network...');
        await this.dockerController.createNetwork('bitbrew');
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
                status: node.status,
            };
        }));
    }

    public async addNode(nodeName: string) {
        if(this.nodes.find((node) => node.name === nodeName)) {
            console.log(`Node ${nodeName} already exists`);
            return;
        }
        const newNode: NodeConfig = {
            name: nodeName,
            port: 18444,
            rpcPort: 18443,
            status: 'initialized',
            dataDir: this.stateController.getNodeDataDir(nodeName),
        };
        this.nodeController.createNode(newNode);
        this.nodes.push(newNode);
        this.stateController.saveState(this.nodes);
    }

    public async startNode(nodeName: string) {
        const node = this.nodes.find((node) => node.name === nodeName);
        if(node === undefined) {
            console.log(`Node ${nodeName} not found`);
            return;
        }
        await this.nodeController.startNode(node);
    }

    public async attachToNode(nodeName: string) {
        const node = this.nodes.find((node) => node.name === nodeName);
        if(node === undefined) {
            console.log(`Node ${nodeName} not found`);
            return;
        }
        await this.dockerController.attachToContainer(node.name);
    }

    public async stopNode(nodeName: string) {
        const node = this.nodes.find((node) => node.name === nodeName);
        if(node === undefined) {
            console.log(`Node ${nodeName} not found`);
            return;
        }
        await this.nodeController.stopNode(node);
    }

    public async removeNode(nodeName: string) {
        const node = this.nodes.find((node) => node.name === nodeName);
        if(node === undefined) {
            console.log(`Node ${nodeName} not found`);
            return;
        }
        await this.nodeController.removeNode(node);
        this.nodes = this.nodes.filter((node) => node.name !== nodeName);
        this.stateController.saveState(this.nodes);
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
        for(const targetNode of targetNodes) {
            await this.nodeController.connectNode(sourceNode, targetNode);
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
        await this.dockerController.removeNetwork('bitbrew');
        this.stateController.deleteAllNodes();
    }
}

export default NetworkController;