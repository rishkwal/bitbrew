export interface NodeConfig {
    name: string;
    port: number;
    rpcPort: number;
    dataDir: string;
    outboundConnections?: string[];
    inboundConnections?: string[];
}

export interface NetworkState {
    nodes: NodeConfig[];
}