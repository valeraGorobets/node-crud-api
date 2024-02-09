import { Method, TController } from './users-api.models';
import {
	allUsersController,
	createUserController,
	deleteUserController,
	pageNotFoundController,
	updateUserController,
	userByIdController,
} from './users-api.controllers';
import * as url from 'node:url';
import * as http from 'node:http';

class Route {
	public method: Method = Method.Get;
	public path: string = '/api/users';
	public isParameterRequired: boolean = false;
	public controller: TController;

	constructor(object: Partial<Route>) {
		Object.assign(this, object);
	}
}

const ROUTE_CONFIGS: Route[] = [
	new Route({
		method: Method.Get,
		isParameterRequired: false,
		controller: allUsersController,
	}),
	new Route({
		method: Method.Get,
		isParameterRequired: true,
		controller: userByIdController,
	}),
	new Route({
		method: Method.Post,
		isParameterRequired: false,
		controller: createUserController,
	}),
	new Route({
		method: Method.Put,
		isParameterRequired: true,
		controller: updateUserController,
	}),
	new Route({
		method: Method.Delete,
		isParameterRequired: true,
		controller: deleteUserController,
	}),
];

export function resolveParameters(request: http.IncomingMessage): string {
	const fullPath = url.parse(request.url!).pathname?.split('/')!;
	const [ _, api, users, parameter ] = fullPath;
	return parameter;
}

export function resolveControllerForRequest(request: http.IncomingMessage): TController {
	const fullPath = url.parse(request.url!).pathname?.split('/')!;
	const [ _, api, users, parameter ] = fullPath;
	const pathname = fullPath.slice(0,3).join('/');
	const controller = ROUTE_CONFIGS.find((route: Route) => {
		return route.method === request.method
			&& route.path === pathname
			&& (route.isParameterRequired ? !!parameter : !parameter);
	})?.controller;

	return controller || pageNotFoundController;
}
