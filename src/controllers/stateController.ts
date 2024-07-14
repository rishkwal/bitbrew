import * as fs from 'fs';
import path from 'path';
import { NodeConfig, NetworkState } from './types.js';
import envPaths from 'env-paths';

export class StateController{
    private readonly appName = 'bitbrew';
    private readonly paths: {
        data: string;
        config: string;
        cache: string;
        log: string;
        temp: string;
    };

    constructor() {
        this.paths = envPaths(this.appName, { suffix: '' });
    }

    public getNodeDataDir(nodeName: string) {
        return path.join(this.paths.data, 'nodes', nodeName);
    }

    public getWalletsDir() {
        return path.join(this.paths.data, 'wallets');
    }

    public getLogDir() {
        return this.paths.log;
    }

    private getStateFile() {
        return path.join(this.paths.data, 'network-state.json');
    }

    private getWalletsFile() {
        return path.join(this.paths.data, 'wallets.json');
    }

    public createPaths() {
        fs.mkdirSync(this.paths.data, { recursive: true });
        fs.mkdirSync(this.paths.log, { recursive: true });
        const walletPath = this.getWalletsDir();
        if (!fs.existsSync(walletPath)) {
            fs.mkdirSync(walletPath, { recursive: true });
        }
    }

    public setNodeStatus(nodeName: string, status: NodeConfig['status']) {
        const state = this.loadState();
        if(state && state.nodes) {
            const node = state.nodes.find(n => n.name === nodeName);
            if(node) {
                node.status = status;
                this.saveState(state.nodes);
            }
        }
    }

    public removeNode(nodeName: string) {
        const state = this.loadState();
        if(state && state.nodes) {
            const nodeIndex = state.nodes.findIndex(n => n.name === nodeName);
            if(nodeIndex >= 0) {
                state.nodes.splice(nodeIndex, 1);
                this.saveState(state.nodes);
                fs.rm(this.getNodeDataDir(nodeName), { recursive: true }, (err) => {
                    if(err) {
                        throw new Error(`Error deleting node data directory: ${err.message}`);
                    }
                });
            }
        }
    }

    public async saveState(nodes: NodeConfig[]) {
        if (!fs.existsSync(this.paths.data)) {
            this.createPaths();
        }
        const state: NetworkState = { nodes, exist: true };
        fs.writeFileSync(this.getStateFile(), JSON.stringify(state, null, 2));
    }

    public loadState(): NetworkState | null{
        if(fs.existsSync(this.getStateFile())) {
            const state: NetworkState = JSON.parse(fs.readFileSync(this.getStateFile(), 'utf-8'));
            return state;
        }
        return null;
    }

    public loadWallets() {
        if(fs.existsSync(this.getWalletsFile())) {
            return JSON.parse(fs.readFileSync(this.getWalletsFile(), 'utf-8'));
        }
        return [];
    }

    public saveWallet(name: string, node: string): Promise<void> {
        const wallets = this.loadWallets();
        wallets.push({ name, node });
        return new Promise((resolve, reject) => {
            fs.writeFileSync(this.getWalletsFile(), JSON.stringify(wallets, null, 2));
        resolve();
        });
    }

    public deleteState() {
        if(fs.existsSync(this.getStateFile())) {
            fs.unlinkSync(this.getStateFile());
        }
    }

    public deleteAllData() {
        if(fs.existsSync(this.paths.data)) {
            fs.rm(this.paths.data,{ recursive: true }, (err) => {
                if(err) {
                    throw new Error(`Error deleting data directory: ${err.message}`);
                }
            });
        }
    }
}