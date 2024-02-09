import * as http from 'node:http';
import { UsersDbService } from '../db/users/users-db.service';
import { controllerAdapter, IControllerOptions, responseServerError } from './users-api.models';
import { resolveControllerForRequest, resolveParameters } from './router';

export class UsersAPIServer {
	constructor(
		public port: number,
		private usersDbService: UsersDbService,
	) {
		this.launchServer(port);
	}

	private launchServer(port: number): void {
		console.log(`UsersAPIServer port: ${ port }`);

		http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse<http.IncomingMessage>) => {
			try {
				const body = await this.getBody(request);
				const controllerOptions: IControllerOptions = {
					request,
					response,
					port: this.port,
					usersDbService: this.usersDbService,
					body,
					parameters: resolveParameters(request),
				};

				const controller = resolveControllerForRequest(request);
				await controllerAdapter(controller, controllerOptions);
			} catch (error) {
				responseServerError(response, error);
			}

		}).listen(port);
	}

	private getBody(request: http.IncomingMessage): Promise<any> {
		return new Promise((resolve, reject) => {
			const chunks: any[] = [];
			request.on('data', (chunk) => {
				chunks.push(chunk);
			}).on('end', () => {
				try {
					const body = Buffer.concat(chunks).toString();
					resolve(body && JSON.parse(body));
				} catch (error) {
					reject('Error during parsing body');
				}

			});
		});
	}
}

