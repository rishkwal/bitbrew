import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NodeController } from '../../src/controllers/nodeController.js';
import { NodeConfig } from '../../src/controllers/types';
import * as fs from 'fs';

vi.mock('fs');

describe('NodeController', () => {
  let dockerControllerMock: any;
  let stateControllerMock: any;
  let nodeController: NodeController;
  let mockContainer: any;

  beforeEach(() => {
    dockerControllerMock = {
      docker: {
        listImages: vi.fn(),
        pull: vi.fn(),
      },
      getContainer: vi.fn(),
      createContainer: vi.fn(),
    };

    stateControllerMock = {
      setNodeStatus: vi.fn(),
      removeNode: vi.fn(),
    };

    mockContainer = {
      inspect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      remove: vi.fn(),
      exec: vi.fn(),
    };

    dockerControllerMock.getContainer.mockReturnValue(mockContainer);

    nodeController = new NodeController(
      dockerControllerMock,
      stateControllerMock,
    );
  });

  describe('createNode', () => {
    it('should create a new node successfully', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'initialized',
        dataDir: '/fake/path',
      };
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
      dockerControllerMock.docker.listImages.mockResolvedValue([
        { Id: 'image-id' },
      ]);
      mockContainer.inspect.mockRejectedValue(new Error('Container not found'));

      await nodeController.createNode(node);

      expect(fs.mkdirSync).toHaveBeenCalledWith(node.dataDir, {
        recursive: true,
      });
      expect(dockerControllerMock.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          Image: 'bitcoin-regtest:1.0',
          name: node.name,
        }),
      );
      expect(stateControllerMock.setNodeStatus).toHaveBeenCalledWith(
        node.name,
        'stopped',
      );
    });

    it('should not create a node if it already exists', async () => {
      const node: NodeConfig = {
        name: 'existing-node',
        port: 18444,
        rpcPort: 18443,
        status: 'initialized',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({});
      dockerControllerMock.docker.listImages.mockResolvedValue([
        { Id: 'bitcoin-regtest' },
      ]);

      await nodeController.createNode(node);

      expect(dockerControllerMock.createContainer).not.toHaveBeenCalled();
      expect(stateControllerMock.setNodeStatus).not.toHaveBeenCalled();
    });

    it('should pull the image if it does not exist', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'initialized',
        dataDir: '/fake/path',
      };
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      dockerControllerMock.docker.listImages.mockResolvedValue([]);
      mockContainer.inspect.mockRejectedValue(new Error('Container not found'));

      await nodeController.createNode(node);

      expect(dockerControllerMock.docker.pull).toHaveBeenCalledWith(
        'bitcoin-regtest:1.0',
      );
      expect(dockerControllerMock.createContainer).toHaveBeenCalled();
    });
  });

  describe('startNode', () => {
    it('should start a node successfully', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'stopped',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({ State: { Running: false } });

      await nodeController.startNode(node);

      expect(mockContainer.start).toHaveBeenCalled();
      expect(stateControllerMock.setNodeStatus).toHaveBeenCalledWith(
        node.name,
        'running',
      );
    });

    it('should not start a node that is already running', async () => {
      const node: NodeConfig = {
        name: 'running-node',
        port: 18444,
        rpcPort: 18443,
        status: 'running',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({ State: { Running: true } });

      await nodeController.startNode(node);

      expect(mockContainer.start).not.toHaveBeenCalled();
      expect(stateControllerMock.setNodeStatus).not.toHaveBeenCalled();
    });

    it('should handle errors when starting a node', async () => {
      const node: NodeConfig = {
        name: 'error-node',
        port: 18444,
        rpcPort: 18443,
        status: 'stopped',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({ State: { Running: false } });
      mockContainer.start.mockRejectedValue(new Error('Start failed'));
      console.error = vi.fn();

      await nodeController.startNode(node);

      expect(console.error).toHaveBeenCalledWith('Start failed');
      expect(stateControllerMock.setNodeStatus).not.toHaveBeenCalled();
    });
  });

  describe('stopNode', () => {
    it('should stop a running node successfully', async () => {
      const node: NodeConfig = {
        name: 'running-node',
        port: 18444,
        rpcPort: 18443,
        status: 'running',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({ State: { Running: true } });

      await nodeController.stopNode(node);

      expect(mockContainer.stop).toHaveBeenCalled();
      expect(stateControllerMock.setNodeStatus).toHaveBeenCalledWith(
        node.name,
        'stopped',
      );
    });

    it('should not stop a node that is already stopped', async () => {
      const node: NodeConfig = {
        name: 'stopped-node',
        port: 18444,
        rpcPort: 18443,
        status: 'stopped',
        dataDir: '/fake/path',
      };
      mockContainer.inspect.mockResolvedValue({ State: { Running: false } });

      await nodeController.stopNode(node);

      expect(mockContainer.stop).not.toHaveBeenCalled();
      expect(stateControllerMock.setNodeStatus).not.toHaveBeenCalled();
    });
  });

  describe('removeNode', () => {
    it('should remove a node successfully', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'stopped',
        dataDir: '/fake/path',
      };

      await nodeController.removeNode(node);

      expect(mockContainer.remove).toHaveBeenCalledWith({ force: true });
      expect(stateControllerMock.removeNode).toHaveBeenCalledWith(node.name);
    });

    it('should handle errors when removing a node', async () => {
      const node: NodeConfig = {
        name: 'error-node',
        port: 18444,
        rpcPort: 18443,
        status: 'stopped',
        dataDir: '/fake/path',
      };
      mockContainer.remove.mockRejectedValue(new Error('Remove failed'));
      console.error = vi.fn();

      await nodeController.removeNode(node);

      expect(console.error).toHaveBeenCalledWith('Remove failed');
      expect(stateControllerMock.removeNode).not.toHaveBeenCalled();
    });
  });

  describe('waitForNodeReady', () => {
    it('should resolve when node is ready', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'running',
        dataDir: '/fake/path',
      };
      const mockExec = {
        start: vi.fn().mockResolvedValue({
          on: vi.fn().mockImplementation((event, callback) => {
            if (event === 'data') callback(Buffer.from('{"chain": "regtest"}'));
            if (event === 'end') callback();
          }),
        }),
      };
      mockContainer.exec.mockResolvedValue(mockExec);

      await expect(
        nodeController.waitForNodeReady(node, 1, 100),
      ).resolves.not.toThrow();
    });

    it('should throw an error if node is not ready after max retries', async () => {
      const node: NodeConfig = {
        name: 'test-node',
        port: 18444,
        rpcPort: 18443,
        status: 'running',
        dataDir: '/fake/path',
      };
      const mockExec = {
        start: vi.fn().mockResolvedValue({
          on: vi.fn().mockImplementation((event, callback) => {
            if (event === 'data') callback(Buffer.from('{"chain": "mainnet"}'));
            if (event === 'end') callback();
          }),
        }),
      };
      mockContainer.exec.mockResolvedValue(mockExec);

      await expect(
        nodeController.waitForNodeReady(node, 1, 100),
      ).rejects.toThrow('Timeout waiting for node test-node to be ready');
    });
  });

  describe('connectNode', () => {
    it('should connect nodes successfully', async () => {
      const sourceNode: NodeConfig = {
        name: 'source-node',
        port: 18444,
        rpcPort: 18443,
        status: 'running',
        dataDir: '/fake/path',
      };
      const targetNode: NodeConfig = {
        name: 'target-node',
        port: 18445,
        rpcPort: 18444,
        status: 'running',
        dataDir: '/fake/path',
      };
      const mockExec = {
        start: vi.fn().mockResolvedValue({}),
      };
      mockContainer.exec.mockResolvedValue(mockExec);

      await nodeController.connectNode(sourceNode, targetNode);

      expect(mockContainer.exec).toHaveBeenCalledWith({
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['bitcoin-cli', 'addnode', targetNode.name, 'add'],
      });
      expect(mockExec.start).toHaveBeenCalledWith({
        hijack: true,
        stdin: true,
      });
    });
  });
});
