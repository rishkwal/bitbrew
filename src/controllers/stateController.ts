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

    public saveState(nodes: NodeConfig[]) {
        if (!fs.existsSync(this.paths.data)) {
            this.createPaths();
        }
        const state: NetworkState = { nodes };
        fs.writeFileSync(this.getStateFile(), JSON.stringify(state, null, 2));
    }

    public loadState(): NodeConfig[] | null {
        if(fs.existsSync(this.getStateFile())) {
            const state: NetworkState = JSON.parse(fs.readFileSync(this.getStateFile(), 'utf-8'));
            return state.nodes;
        }
        return null;
    }

    public deleteState() {
        if(fs.existsSync(this.getStateFile())) {
            fs.unlinkSync(this.getStateFile());
        }
    }
}