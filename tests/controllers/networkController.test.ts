import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NetworkController } from '../../src/controllers/networkController.js';
import { NodeConfig } from '../../src/controllers/types';

describe('NetworkController', () => {
    let stateControllerMock: any;
    let dockerControllerMock: any;
    let nodeControllerMock: any;
    let networkController: NetworkController;

    beforeEach(() => {
        stateControllerMock = {
            loadState: vi.fn(),
            saveState: vi.fn(),
            createPaths: vi.fn(),
            deleteState: vi.fn(),
            getNodeDataDir: vi.fn().mockReturnValue('/fake/path'),
            deleteAllNodes: vi.fn(),
        };
        
        dockerControllerMock = {
            createNetwork: vi.fn().mockResolvedValue(undefined),
            removeNetwork: vi.fn().mockResolvedValue(undefined),
            execCommand: vi.fn(),
            attachToContainer: vi.fn(),
            getContainer: vi.fn().mockReturnValue({
                remove: vi.fn().mockResolvedValue(undefined)
            })
        };

        nodeControllerMock = {
            createNode: vi.fn().mockResolvedValue(undefined),
            startNode: vi.fn().mockResolvedValue(undefined),
            stopNode: vi.fn().mockResolvedValue(undefined),
            removeNode: vi.fn().mockResolvedValue(undefined),
            connectNode: vi.fn().mockResolvedValue(undefined),
            waitForNodeReady: vi.fn().mockResolvedValue(undefined),
        };

        networkController = new NetworkController(stateControllerMock, dockerControllerMock, nodeControllerMock);
    });

    describe('initializeNodes', () => {
        it('should initialize nodes when none exist', () => {
            stateControllerMock.loadState.mockReturnValue(null);
            const numberOfNodes = 3;
            const result = networkController.initializeNodes(numberOfNodes);

            expect(result).toBe(true);
            expect(networkController.nodes.length).toBe(numberOfNodes);
            expect(stateControllerMock.saveState).toHaveBeenCalledWith(networkController.nodes);
            networkController.nodes.forEach((node, index) => {
                expect(node).toEqual({
                    name: `node-${index}`,
                    port: 18444,
                    rpcPort: 18443,
                    status: 'initialized',
                    dataDir: '/fake/path',
                });
            });
        });

        it('should not initialize nodes if they already exist', () => {
            const existingNodes = [{ name: 'node-0', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' }];
            stateControllerMock.loadState.mockReturnValue({ nodes: existingNodes });
            networkController = new NetworkController(stateControllerMock, dockerControllerMock, nodeControllerMock);
            
            const result = networkController.initializeNodes(2);

            expect(result).toBe(false);
            expect(networkController.nodes).toEqual(existingNodes);
            expect(stateControllerMock.saveState).not.toHaveBeenCalled();
        });

        it('should not initialize if network exists but nodes don\'t', () => {
            stateControllerMock.loadState.mockReturnValue({ nodes: [], exist: true });
            const numberOfNodes = 3;
            const result = networkController.initializeNodes(numberOfNodes);

            expect(result).toBe(false);
        }) 
    });

    describe('startNetwork', () => {
        it('should start the network successfully', async () => {
            const nodes = [
                { name: 'node-0', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' },
                { name: 'node-1', port: 18445, rpcPort: 18444, status: 'initialized', dataDir: '/fake/path' },
            ];
            stateControllerMock.loadState.mockReturnValue({ nodes });
            networkController = new NetworkController(stateControllerMock, dockerControllerMock, nodeControllerMock);

            await networkController.startNetwork();

            expect(dockerControllerMock.createNetwork).toHaveBeenCalledWith('bitbrew');
            nodes.forEach(node => {
                expect(nodeControllerMock.createNode).toHaveBeenCalledWith(node);
                expect(nodeControllerMock.startNode).toHaveBeenCalledWith(node);
                expect(nodeControllerMock.waitForNodeReady).toHaveBeenCalledWith(node);
            });
        });

        it('should handle errors when starting the network', async () => {
            dockerControllerMock.createNetwork.mockRejectedValue(new Error('Network creation failed'));
            
            await expect(networkController.startNetwork()).rejects.toThrow('Network creation failed');
        });
    });

    describe('addNode', () => {
        it('should add a new node successfully', async () => {
            const nodeName = 'node-new';
            await networkController.addNode(nodeName);

            expect(nodeControllerMock.createNode).toHaveBeenCalledWith(expect.objectContaining({ name: nodeName }));
            expect(networkController.nodes).toContainEqual(expect.objectContaining({ name: nodeName }));
            expect(stateControllerMock.saveState).toHaveBeenCalledWith(networkController.nodes);
        });

        it('should not add a node if it already exists', async () => {
            const existingNode: NodeConfig = { name: 'existing-node', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' };
            networkController.nodes = [existingNode];

            await networkController.addNode('existing-node');

            expect(nodeControllerMock.createNode).not.toHaveBeenCalled();
            expect(networkController.nodes).toEqual([existingNode]);
            expect(stateControllerMock.saveState).not.toHaveBeenCalled();
        });
    });

    describe('removeNode', () => {
        it('should remove an existing node', async () => {
            const nodeToRemove: NodeConfig = { name: 'node-to-remove', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' };
            networkController.nodes = [nodeToRemove];

            await networkController.removeNode('node-to-remove');

            expect(nodeControllerMock.removeNode).toHaveBeenCalledWith(nodeToRemove);
            expect(networkController.nodes).toEqual([]);
            expect(stateControllerMock.saveState).toHaveBeenCalledWith([]);
        });

        it('should handle removing a non-existent node', async () => {
            networkController.nodes = [];

            await networkController.removeNode('non-existent-node');

            expect(nodeControllerMock.removeNode).not.toHaveBeenCalled();
            expect(stateControllerMock.saveState).not.toHaveBeenCalled();
        });
    });

    describe('connectNodes', () => {
        it('should connect nodes successfully', async () => {
            const sourceNode: NodeConfig = { name: 'source-node', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' };
            const targetNode: NodeConfig = { name: 'target-node', port: 18445, rpcPort: 18444, status: 'initialized', dataDir: '/fake/path' };

            networkController.nodes = [sourceNode, targetNode];

            await networkController.connectNodes('source-node', ['target-node']);

            expect(nodeControllerMock.connectNode).toHaveBeenCalledWith(sourceNode, targetNode);
        });

        it('should throw an error when connecting non-existent nodes', async () => {
            networkController.nodes = [];

            await expect(networkController.connectNodes('non-existent', ['also-non-existent']))
                .rejects.toThrow('Node non-existent not found');
        });
    });

    describe('cleanNetwork', () => {
        it('should clean the network successfully', async () => {
            const nodes: NodeConfig[] = [
                { name: 'node-0', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' },
                { name: 'node-1', port: 18445, rpcPort: 18444, status: 'initialized', dataDir: '/fake/path' },
            ];
            networkController.nodes = nodes;

            await networkController.cleanNetwork();

            nodes.forEach(node => {
                expect(dockerControllerMock.getContainer(node.name).remove).toHaveBeenCalledWith({ force: true });
            });
            expect(dockerControllerMock.removeNetwork).toHaveBeenCalledWith('bitbrew');
            expect(stateControllerMock.deleteAllNodes).toHaveBeenCalled();
        });

        it('should handle errors when cleaning the network', async () => {
            const errorNode: NodeConfig = { name: 'error-node', port: 18444, rpcPort: 18443, status: 'initialized', dataDir: '/fake/path' };
            networkController.nodes = [errorNode];
            
            dockerControllerMock.getContainer(errorNode.name).remove.mockRejectedValue(new Error('Container removal failed'));
            console.log = vi.fn(); // Mock console.log to check error logging

            await networkController.cleanNetwork();

            expect(console.log).toHaveBeenCalledWith('Error removing container for error-node');
            expect(dockerControllerMock.removeNetwork).toHaveBeenCalledWith('bitbrew');
            expect(stateControllerMock.deleteAllNodes).toHaveBeenCalled();
        });
    });
});