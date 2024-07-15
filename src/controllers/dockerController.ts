import Dockerode from 'dockerode';
import { spawn } from 'child_process';
import { clilog } from '../utils/cliLogger.js';
import prettyjson from 'prettyjson';

export class DockerController {
  docker: Dockerode;

  constructor() {
    this.docker = new Dockerode();
  }

  async pullImage(image: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
        if (err) {
          reject(err);
        } else if (stream) {
          this.docker.modem.followProgress(
            stream,
            (err, res) => {
              if (err) {
                reject(err);
              } else {
                clilog.success('Image pulled successfully.');
                resolve();
              }
            },
            (event) => clilog.info(`Pulling image: ${event.status}`),
          );
        } else {
          reject(new Error('Stream is undefined'));
        }
      });
    });
  }

  async createNetwork(name: string) {
    const checkNetwork = await this.docker.listNetworks({
      filters: { name: [name] },
    });
    if (checkNetwork && checkNetwork.length > 0) {
      clilog.warn('Network already exists');
    }
    await this.docker.createNetwork({ Name: name });
  }

  async createContainer(config: Dockerode.ContainerCreateOptions) {
    return this.docker.createContainer(config);
  }

  getContainer(name: string) {
    return this.docker.getContainer(name);
  }

  public async execCommand(
    containerName: string,
    command: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn(
        'docker',
        ['exec', '-i', containerName, 'sh', '-c', command],
        {
          stdio: ['ignore', 'pipe', 'pipe'], // stdin ignored, stdout and stderr piped
        },
      );

      let output = '';
      dockerProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      dockerProcess.stderr.on('data', (data) => {
        output += data.toString(); // Optionally handle stderr differently
      });

      dockerProcess.on('close', (code) => {
        try {
          const formattedOutput = prettyjson.render(JSON.parse(output));
          console.log(formattedOutput);
          resolve(output);
        } catch (err) {
          console.log(output);
        }
      });

      dockerProcess.on('error', (err) => {
        throw new Error('Failed to start docker process');
      });
    });
  }

  public async getExecOutput(
    containerName: string,
    command: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn(
        'docker',
        ['exec', '-i', containerName, 'sh', '-c', command],
        {
          stdio: ['ignore', 'pipe', 'pipe'], // stdin ignored, stdout and stderr piped
        },
      );

      let output = '';
      dockerProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      dockerProcess.stderr.on('data', (data) => {
        output += data.toString(); // Optionally handle stderr differently
      });

      dockerProcess.on('close', (code) => {
        // console.log(`Docker process exited with code ${code}`);
        resolve(output);
      });

      dockerProcess.on('error', (err) => {
        throw new Error('Failed to start docker process:');
      });
    });
  }

  attachToContainer(name: string) {
    const dockerProcess = spawn(
      'docker',
      ['exec', '-it', name, 'sh', '-c', `PS1='${name} $ ' sh`],
      {
        stdio: 'inherit',
      },
    );

    dockerProcess.on('close', (code) => {
      //   console.log(`Docker process exited with code ${code}`);
    });

    dockerProcess.on('error', (err) => {
      throw new Error('Failed to start docker process');
    });
  }

  async removeNetwork(name: string) {
    const network = this.docker.getNetwork(name);
    if (!network) {
      throw new Error('Network not found');
    }
    try {
      await network.remove();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An error occurred');
      }
    }
  }
}
