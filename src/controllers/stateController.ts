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

    public getLogDir() {
        return this.paths.log;
    }

    private getStateFile() {
        return path.join(this.paths.data, 'network-state.json');
    }

    public createPaths() {
        fs.mkdirSync(this.paths.data, { recursive: true });
        fs.mkdirSync(this.paths.log, { recursive: true });
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

    public saveState(nodes: NodeConfig[]) {
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

    public deleteState() {
        if(fs.existsSync(this.getStateFile())) {
            fs.unlinkSync(this.getStateFile());
        }
    }

    public deleteAllNodes() {
        if(fs.existsSync(this.paths.data)) {
            fs.rm(this.paths.data,{ recursive: true }, () => {
                console.log('Deleted all nodes');
            });
        }
    }
}