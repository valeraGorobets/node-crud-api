import * as http from 'node:http';
import { UsersDbService } from '../db/users/users-db.service';

export enum Method {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export type TController<T = any> = (controllerOptions: IControllerOptions) => Promise<IControllerResponse<T>>;

export interface IControllerOptions {
	port: number;
	request: http.IncomingMessage;
	response: http.ServerResponse<http.IncomingMessage>;
	usersDbService: UsersDbService;
	body?: any;
	parameters?: string;
}

export interface IControllerResponse<T = any> {
	statusCode: number;
	data?: T;
}

export function responseServerError(response: http.ServerResponse<http.IncomingMessage>, error: any): void {
	response.writeHead(500);
	response.write(JSON.stringify(error));
	response.end();
}

export async function controllerAdapter<T = any>(
	controller: TController<T>,
	controllerOptions: IControllerOptions,
): Promise<void> {
	const { port, response } = controllerOptions;
	response.setHeader('Port', port);

	try {
		const { statusCode, data }: IControllerResponse<T> = await controller(controllerOptions);
		response.writeHead(statusCode, { 'Content-Type': 'application/json' });
		if (data) {
			response.write(JSON.stringify(data));
		}
		response.end();
	} catch (error) {
		responseServerError(response, error);
	}
}
