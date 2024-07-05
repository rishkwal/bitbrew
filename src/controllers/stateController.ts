import * as fs from 'fs';
import { NodeConfig, NetworkState } from './types';
import * as envPaths from 'env-paths';

export class StateController{
    private readonly stateFile: string;

    constructor(stateFilePath: string) {
        this.stateFile = stateFilePath;
    }

    saveState(nodes: NodeConfig[]) {
        const state: NetworkState = { nodes };
        fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    }

    loadState(): NodeConfig[] | null {
        if(fs.existsSync(this.stateFile)) {
            const state: NetworkState = JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
            return state.nodes;
        }
        return null;
    }

    deleteState() {
        if(fs.existsSync(this.stateFile)) {
            fs.unlinkSync(this.stateFile);
        }
    }
}