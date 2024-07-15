import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DockerController } from '../../src/controllers/dockerController.js';
import Dockerode from 'dockerode';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';

vi.mock('dockerode');
vi.mock('child_process');

describe('DockerController', () => {
  let dockerController: DockerController;
  let mockDocker: any;

  beforeEach(() => {
    mockDocker = {
      pull: vi.fn(),
      modem: {
        followProgress: vi.fn(),
      },
      listNetworks: vi.fn(),
      createNetwork: vi.fn(),
      createContainer: vi.fn(),
      getContainer: vi.fn(),
      getNetwork: vi.fn(),
    };

    (Dockerode as any).mockImplementation(() => mockDocker);
    dockerController = new DockerController();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('pullImage', () => {
    it('should pull an image successfully', async () => {
      const mockStream = new EventEmitter();
      mockDocker.pull.mockImplementation(
        (
          image: string,
          callback: (err: Error | null, stream: EventEmitter) => void,
        ) => {
          callback(null, mockStream);
        },
      );

      mockDocker.modem.followProgress.mockImplementation(
        (
          stream: EventEmitter,
          onFinished: (err: Error | null, output: any[]) => void,
        ) => {
          onFinished(null, []);
        },
      );

      await expect(
        dockerController.pullImage('test-image'),
      ).resolves.not.toThrow();
      expect(mockDocker.pull).toHaveBeenCalledWith(
        'test-image',
        expect.any(Function),
      );
    });

    it('should handle errors when pulling an image', async () => {
      mockDocker.pull.mockImplementation(
        (image: string, callback: (err: Error) => void) => {
          callback(new Error('Pull failed'));
        },
      );

      await expect(dockerController.pullImage('test-image')).rejects.toThrow(
        'Pull failed',
      );
    });
  });

  describe('createNetwork', () => {
    it('should create a network if it does not exist', async () => {
      mockDocker.listNetworks.mockResolvedValue([]);
      await dockerController.createNetwork('test-network');
      expect(mockDocker.createNetwork).toHaveBeenCalledWith({
        Name: 'test-network',
      });
    });

    it('should not create a network if it already exists', async () => {
      mockDocker.listNetworks.mockResolvedValue([{ Name: 'test-network' }]);
      await dockerController.createNetwork('test-network');
      expect(mockDocker.createNetwork).not.toHaveBeenCalled();
    });
  });

  describe('createContainer', () => {
    it('should create a container', async () => {
      const config = { Image: 'test-image' };
      await dockerController.createContainer(config);
      expect(mockDocker.createContainer).toHaveBeenCalledWith(config);
    });
  });

  describe('getContainer', () => {
    it('should get a container', () => {
      const mockContainer = { id: 'test-container' };
      mockDocker.getContainer.mockReturnValue(mockContainer);
      const container = dockerController.getContainer('test-container');
      expect(container).toBe(mockContainer);
    });
  });

  describe('execCommand', () => {
    it('should execute a command in a container', () => {
      const mockSpawn = vi.mocked(spawn);
      mockSpawn.mockReturnValue({
        on: vi.fn(),
      } as any);

      dockerController.execCommand('test-container', 'test-command');

      expect(mockSpawn).toHaveBeenCalledWith(
        'docker',
        ['exec', '-it', 'test-container', 'sh', '-c', 'test-command'],
        { stdio: 'inherit' },
      );
    });
  });

  describe('attachToContainer', () => {
    it('should attach to a container', () => {
      const mockSpawn = vi.mocked(spawn);
      mockSpawn.mockReturnValue({
        on: vi.fn(),
      } as any);

      dockerController.attachToContainer('test-container');

      expect(mockSpawn).toHaveBeenCalledWith(
        'docker',
        ['exec', '-it', 'test-container', 'sh'],
        { stdio: 'inherit' },
      );
    });
  });

  describe('removeNetwork', () => {
    it('should remove a network if it exists', async () => {
      const mockNetwork = {
        remove: vi.fn().mockResolvedValue(undefined),
      };
      mockDocker.getNetwork.mockReturnValue(mockNetwork);

      await dockerController.removeNetwork('test-network');

      expect(mockNetwork.remove).toHaveBeenCalled();
    });

    it('should handle non-existent networks', async () => {
      mockDocker.getNetwork.mockReturnValue(null);
      console.log = vi.fn();

      await dockerController.removeNetwork('non-existent-network');

      expect(console.log).toHaveBeenCalledWith('Network not found');
    });

    it('should handle errors when removing a network', async () => {
      const mockNetwork = {
        remove: vi.fn().mockRejectedValue(new Error('Remove failed')),
      };
      mockDocker.getNetwork.mockReturnValue(mockNetwork);
      console.error = vi.fn();

      await dockerController.removeNetwork('test-network');

      expect(console.error).toHaveBeenCalledWith('Remove failed');
    });
  });
});
