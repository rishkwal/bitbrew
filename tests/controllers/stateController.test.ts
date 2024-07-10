import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StateController } from '../../src/controllers/stateController.js';
import { NodeConfig, NetworkState } from '../../src/controllers/types';
import * as fs from 'fs';
import envPaths from 'env-paths';

vi.mock('fs');
vi.mock('path', () => ({
    default: {
        join: (...args: string[]) => args.join('/'),
    },
}));
vi.mock('env-paths', () => ({
    default: vi.fn(),
}));

describe('StateController', () => {
    let stateController: StateController;
    const mockPaths = {
        data: '/fake/data',
        config: '/fake/config',
        cache: '/fake/cache',
        log: '/fake/log',
        temp: '/fake/temp',
    };

    beforeEach(() => {
        vi.resetAllMocks();
        (envPaths as any).mockReturnValue(mockPaths);
        stateController = new StateController();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getNodeDataDir', () => {
        it('should return the correct node data directory', () => {
            const nodeName = 'test-node';
            const expected = '/fake/data/nodes/test-node';
            expect(stateController.getNodeDataDir(nodeName)).toBe(expected);
        });
    });

    describe('getLogDir', () => {
        it('should return the correct log directory', () => {
            expect(stateController.getLogDir()).toBe('/fake/log');
        });
    });

    describe('createPaths', () => {
        it('should create data and log directories', () => {
            stateController.createPaths();
            expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/data', { recursive: true });
            expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/log', { recursive: true });
        });
    });

    describe('setNodeStatus', () => {
        it('should update node status in the state', () => {
            const mockState: NetworkState = {
                nodes: [{ name: 'test-node', status: 'initialized', port: 18444, rpcPort: 18443, dataDir: '/fake/data/nodes/test-node' }],
                exist: true,
            };
            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockState));
            vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

            stateController.setNodeStatus('test-node', 'running');

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                '/fake/data/network-state.json',
                JSON.stringify({
                    nodes: [{ name: 'test-node', status: 'running', port: 18444, rpcPort: 18443, dataDir: '/fake/data/nodes/test-node' }],
                    exist: true,
                }, null, 2)
            );
        });
    });

    describe('removeNode', () => {
        it('should remove a node from the state', () => {
            const mockState: NetworkState = {
                nodes: [
                    { name: 'node1', status: 'initialized', port: 18444, rpcPort: 18443, dataDir: '/fake/data/nodes/node1' },
                    { name: 'node2', status: 'initialized', port: 18445, rpcPort: 18444, dataDir: '/fake/data/nodes/node2' },
                ],
                exist: true,
            };
            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockState));
            vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

            stateController.removeNode('node1');

            expect(fs.writeFileSync).toHaveBeenCalledWith(
                '/fake/data/network-state.json',
                JSON.stringify({
                    nodes: [{ name: 'node2', status: 'initialized', port: 18445, rpcPort: 18444, dataDir: '/fake/data/nodes/node2' }],
                    exist: true,
                }, null, 2)
            );
        });
    });

    describe('saveState', () => {
        it('should save the state to a file', () => {
            const nodes: NodeConfig[] = [
                { name: 'node1', status: 'initialized', port: 18444, rpcPort: 18443, dataDir: '/fake/data/nodes/node1' },
            ];
            vi.spyOn(fs, 'existsSync').mockReturnValue(false);
            vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
            vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

            stateController.saveState(nodes);

            expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/data', { recursive: true });
            expect(fs.mkdirSync).toHaveBeenCalledWith('/fake/log', { recursive: true });
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                '/fake/data/network-state.json',
                JSON.stringify({ nodes, exist: true }, null, 2)
            );
        });
    });

    describe('loadState', () => {
        it('should load the state from a file', () => {
            const mockState: NetworkState = {
                nodes: [{ name: 'node1', status: 'initialized', port: 18444, rpcPort: 18443, dataDir: '/fake/data/nodes/node1' }],
                exist: true,
            };
            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockState));

            const loadedState = stateController.loadState();

            expect(loadedState).toEqual(mockState);
        });

        it('should return null if state file does not exist', () => {
            vi.spyOn(fs, 'existsSync').mockReturnValue(false);

            const loadedState = stateController.loadState();

            expect(loadedState).toBeNull();
        });
    });

    describe('deleteState', () => {
        it('should delete the state file if it exists', () => {
            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

            stateController.deleteState()

            expect(fs.unlinkSync).toHaveBeenCalledWith('/fake/data/network-state.json');
        });

        it('should not attempt to delete the state file if it does not exist', () => {
            vi.spyOn(fs, 'existsSync').mockReturnValue(false);
            vi.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

            stateController.deleteState();

            expect(fs.unlinkSync).not.toHaveBeenCalled();
        });
    });

    describe('deleteAllNodes', () => {
        it('should delete all nodes if the data directory exists', () => {
            vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            vi.spyOn(fs, 'rm').mockImplementation((path, options, callback) => {
                callback(null);
            });
            console.log = vi.fn();

            stateController.deleteAllNodes();

            expect(fs.rm).toHaveBeenCalledWith('/fake/data', { recursive: true }, expect.any(Function));
            expect(console.log).toHaveBeenCalledWith('Deleted all nodes');
        });

        it('should not attempt to delete nodes if the data directory does not exist', () => {
            vi.spyOn(fs, 'existsSync').mockReturnValue(false);
            vi.spyOn(fs, 'rm').mockImplementation(() => {});

            stateController.deleteAllNodes();

            expect(fs.rm).not.toHaveBeenCalled();
        });
    });
});