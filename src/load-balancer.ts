import cluster from 'cluster';
import * as http from 'node:http';
import * as process from 'node:process';
import { Worker } from 'cluster';
import { UsersAPIServer } from './api/users-api-server';
import * as os from 'os';
import { UsersDbService } from './db/users/users-db.service';
import { Utils } from './utils';

class LoadBalancer {
	private readonly baseServerPort: number = (process.env.BASEPORT && parseInt(process.env.BASEPORT)) || 4000;
	private readonly workers: Map<number, Worker> = new Map<number, Worker>();
	private currentWorkerPort: number;

	constructor(
		private readonly clustersToCreate: number,
	) {
		this.initChildClusters();
		this.launchBalancerServer();
	}

	private initChildClusters(): void {
		for (let i = 0; i < this.clustersToCreate; i++) {
			const workerId: number = i + 1;
			const port: number = this.getServerPort(workerId);
			const env = {
				port,
			};

			const worker: Worker = cluster.fork(env);
			this.workers.set(port, worker);
		}

		cluster.on('exit', (worker, code, signal) => {
			console.log(`worker ${ worker.process.pid } died`);
		});
	}

	private getNextWorkerPort(): number {
		const workerPorts: number[] = Array.from(this.workers.keys());
		const currentIndex: number = workerPorts.indexOf(this.currentWorkerPort);
		const nextIndex: number = currentIndex + 1;
		this.currentWorkerPort = workerPorts[nextIndex] || workerPorts[0];
		return this.currentWorkerPort;
	}

	private launchBalancerServer(): void {
		const serverPort: number = this.getServerPort();
		console.log(`Load balancer port: ${ serverPort }`);

		http.createServer((req, res) => {
			const port: number = this.getNextWorkerPort();
			const host: string = req.headers['host']!.split(':')[0];
			const redirectURL = `http://${ host }:${ port }${ req.url }`;
			res.writeHead(307, { Location: redirectURL });
			res.end();
		}).listen(serverPort);
	}

	private getServerPort(workerId: number = 0): number {
		return this.baseServerPort + workerId;
	}
}

(function () {
	const clustersToCreate: number = Utils.isMultiThreadArgvFlag()
		? os.availableParallelism() - 1
		: 1;

	if (cluster.isPrimary) {
		new LoadBalancer(clustersToCreate);
	} else {
		const port = (process.env.port && parseInt(process.env.port)) || 0;
		new UsersAPIServer(port, new UsersDbService());
	}
})();
