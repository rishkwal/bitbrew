import Dockerode from "dockerode";

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