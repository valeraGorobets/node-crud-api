import cluster from 'node:cluster';
import http from 'node:http';
import process from 'node:process';
import { Worker } from 'cluster';
import { Server } from './server';
import * as os from 'os';
import * as url from 'url';

class LoadBalancer {
	private readonly baseServerPort: number = 4000;
	private readonly workers: Map<number, Worker> = new Map<number, Worker>();
	private currentWorkerPort: number;

	constructor() {
		this.initChildClusters();
		this.launchBalancerServer();
	}

	private initChildClusters(): void {
		// const clustersToCreate: number = os.availableParallelism() - 1;
		const clustersToCreate: number = 2;

		for (let i = 0; i < clustersToCreate; i++) {
			const workerId: number = i + 1;
			const port: number = this.getServerPort(workerId);
			const env = {
				port,
			};

			const worker: Worker = cluster.fork(env);
			this.workers.set(port, worker);
		}

		cluster.on('exit', (worker, code, signal) => {
			console.log(`worker ${worker.process.pid} died`);
		});
	}

	private getNextWorkerPort(): number {
		const workerPorts: number[] = [...this.workers.keys()];
		const currentIndex: number = workerPorts.indexOf(this.currentWorkerPort);
		const nextIndex: number = currentIndex + 1;
		this.currentWorkerPort = workerPorts[nextIndex] || workerPorts[0];
		return this.currentWorkerPort;
	}

	private launchBalancerServer(): void {
		const serverPort: number = this.getServerPort();
		console.log(`Load balancer port: ${serverPort}`);

		http.createServer((req, res) => {
			const port: number = this.getNextWorkerPort();
			const host: string = req.headers['host']!.split(':')[0];
			const redirectURL = `http://${host}:${port}${req.url}`;
			res.writeHead(301, { Location: redirectURL });
			// res.writeHead(301, { 'Location' : '/view/index.html' });

			res.end();
		}).listen(serverPort);
	}

	private getServerPort(workerId: number = 0): number {
		return this.baseServerPort + workerId;
	}
}

(function () {
	if (cluster.isPrimary) {
		new LoadBalancer();
	} else {
		const port = (process.env.port && parseInt(process.env.port)) || 0;
		new Server(port);
	}
})();
