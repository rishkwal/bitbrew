import * as fs from 'fs';
import path from 'path';
import { NodeConfig, NetworkState } from './types.js';
import envPaths from 'env-paths';

export class StateController{
    private readonly stateFile: string;
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
        this.createPaths();
        this.stateFile = path.join(this.paths.data, 'network-state.json');
    }

    public getNodeDataDir(nodeName: string) {
        return path.join(this.paths.data, 'nodes', nodeName);
    }

    public getLogDir() {
        return this.paths.log;
    }

    private createPaths() {
        fs.mkdirSync(this.paths.data, { recursive: true });
        fs.mkdirSync(this.paths.log, { recursive: true });
    }

    public saveState(nodes: NodeConfig[]) {
        if (!fs.existsSync(this.paths.data)) {
            this.createPaths();
        }
        const state: NetworkState = { nodes };
        fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    }

    public loadState(): NodeConfig[] | null {
        if(fs.existsSync(this.stateFile)) {
            const state: NetworkState = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
            return state.nodes;
        }
        return null;
    }

    public deleteState() {
        if(fs.existsSync(this.stateFile)) {
            fs.unlinkSync(this.stateFile);
        }
    }
}