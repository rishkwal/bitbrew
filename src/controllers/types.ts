export interface NodeConfig {
    name: string;
    port: number;
    rpcPort: number;
    status: 'stopped' | 'running' | 'initialized' | 'ready' | 'error';
    dataDir: string;
    outboundConnections: string[];
    inboundConnections: string[];
}

export interface NetworkState {
    nodes: NodeConfig[];
    exist: boolean;
}