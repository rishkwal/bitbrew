import Dockerode from "dockerode";
import { spawn } from "child_process";

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
                    this.docker.modem.followProgress(stream, (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Image pulled successfully.');
                            resolve();
                        }
                    }, (event) => console.log('Pulling image:', event.status));
                } else {
                    reject(new Error('Stream is undefined'));
                }
            })
        })
    }

    async createNetwork(name: string) {
        const checkNetwork = await this.docker.listNetworks({ filters: { name: [name] } });
        if ( checkNetwork && checkNetwork.length > 0 ) {
            console.log('Network already exists');
            return;
        }
        await this.docker.createNetwork({ Name: name });
        console.log('Network created');
    }

    async createContainer(config: Dockerode.ContainerCreateOptions) {
        return this.docker.createContainer(config);
    }

    getContainer(name: string) {
        return this.docker.getContainer(name);
    }

    public execCommand(containerName: string, command: string) {
        const dockerProcess = spawn('docker', ['exec', '-it', containerName, 'sh', '-c', command], {
          stdio: 'inherit'
        });
      
        dockerProcess.on('close', (code) => {
          console.log(`Docker process exited with code ${code}`);
        });
      
        dockerProcess.on('error', (err) => {
          console.error('Failed to start docker process:', err);
        });
    }
    
    public async getExecOutput(containerName: string, command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const dockerProcess = spawn('docker', ['exec', '-i', containerName, 'sh', '-c', command], {
                stdio: ['ignore', 'pipe', 'pipe'] // stdin ignored, stdout and stderr piped
            });
    
            let output = '';
            dockerProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
    
            dockerProcess.stderr.on('data', (data) => {
                output += data.toString(); // Optionally handle stderr differently
            });
    
            dockerProcess.on('close', (code) => {
                console.log(`Docker process exited with code ${code}`);
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(new Error(`Docker process exited with code ${code}`));
                }
            });
    
            dockerProcess.on('error', (err) => {
                console.error('Failed to start docker process:', err);
                reject(err);
            });
        });
    }
   

    attachToContainer(name: string) {
        const dockerProcess = spawn('docker', ['exec', '-it', name, 'sh', '-c', `PS1='${name} $ ' sh`], {
          stdio: 'inherit'
        });
      
        dockerProcess.on('close', (code) => {
          console.log(`Docker process exited with code ${code}`);
        });
      
        dockerProcess.on('error', (err) => {
          console.error('Failed to start docker process:', err);
        });
    }

    async removeNetwork(name: string) {
        const network = this.docker.getNetwork(name);
        if (!network) {
            console.log('Network not found');
            return;
        }
        try {
            await network.remove();
            console.log('Network removed');
        } catch (error: unknown) {
            if(error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An error occurred');
            }
        }
    }
}