import Dockerode from "dockerode";
export interface NodeConfig {
    name: string;
    port: number;
    rpcPort: number;
    status: 'stopped' | 'running' | 'initialized' | 'ready' | 'error';
    dataDir: string;
}

export interface NetworkState {
    nodes: NodeConfig[];
    exist: boolean;
}

export interface Wallet {
    name: string;
    node: string;
}

export interface IStateController {
    loadState(): NetworkState | null;
    saveState(nodes: NodeConfig[]): Promise<void>;
    createPaths(): void;
    deleteState(): void;
    getNodeDataDir(nodeName: string): string;
    loadWallets(): Wallet[];
    getWalletsDir(): string;
    saveWallet(name: string, node: string): Promise<void>;
    removeNode(nodeName: string): void;
    deleteAllData(): void;
    setNodeStatus(nodeName: string, status: NodeConfig['status']): void;
}

export interface IDockerController {
    createNetwork(name: string): Promise<void>;
    removeNetwork(name: string): Promise<void>;
    execCommand(containerName: string, command: string): Promise<string>;
    getExecOutput(containerName: string, command: string): Promise<string>;
    attachToContainer(containerName: string): void;
    getContainer(containerName: string): any;
    pullImage(imageName: string): Promise<void>;
    createContainer(config: Dockerode.ContainerCreateOptions): Promise<Dockerode.Container>;
    docker: Dockerode;
}

export interface INodeController {
    createNode(node: NodeConfig): Promise<void>;
    startNode(node: NodeConfig): Promise<void>;
    stopNode(node: NodeConfig): Promise<void>;
    removeNode(node: NodeConfig): Promise<void>;
    connectNode(sourceNode: NodeConfig, targetNode: NodeConfig): Promise<void>;
    waitForNodeReady(node: NodeConfig): Promise<void>;
}