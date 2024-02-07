import http from 'node:http';

export class Server {
	constructor(
		public port: number,
	) {
		this.launchServer(port);
	}

	private launchServer(port: number): void {
		console.log(`Worker port: ${port}`);

		http.createServer((req, res) => {
			res.writeHead(200);
			res.end('hello world 2 from port: ' + port);
		}).listen(port);

	}
}
