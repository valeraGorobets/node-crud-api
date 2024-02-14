import { areRequiredUserFieldsValid, User } from '../db/users/users-db.models';
import { IControllerOptions, IControllerResponse } from './users-api.models';
import { Utils } from '../utils';

export async function allUsersController(
	{ usersDbService }: IControllerOptions,
): Promise<IControllerResponse<User[]>> {
	const users: User[] = await usersDbService.getAllUsers();
	return { statusCode: 200, data: users };
}

export async function userByIdController(
	{ parameters: uuid, usersDbService }: IControllerOptions,
): Promise<IControllerResponse> {
	if (!Utils.isValidUUID(uuid)) {
		return { statusCode: 400, data: `UUID ${ uuid } is not valid` }
	}
	const user: User | undefined = await usersDbService.getAllUsersByUUID(uuid!);
	return !!user
		? { statusCode: 200, data: user }
		: { statusCode: 404, data: `User with id ${ uuid } not found` };
}

export async function createUserController(
	{ body, usersDbService }: IControllerOptions,
): Promise<IControllerResponse> {
	if (!areRequiredUserFieldsValid(body)) {
		return { statusCode: 400, data: 'Missing proper Users properties or their values are not valid' };
	}
	const newUser: User = await usersDbService.createUser(body);
	return { statusCode: 201, data: newUser };
}

export async function updateUserController(
	{ body, parameters: uuid, usersDbService }: IControllerOptions,
): Promise<IControllerResponse> {
	if (!Utils.isValidUUID(uuid)) {
		return { statusCode: 400, data: `UUID ${ uuid } is not valid` }
	}
	const user: User | undefined = await usersDbService.updateUser(uuid!, body);
	return !!user
		? { statusCode: 200 }
		: { statusCode: 404, data: `User with id ${ uuid } not found` };
}

export async function deleteUserController(
	{ parameters: uuid, usersDbService }: IControllerOptions,
): Promise<IControllerResponse> {
	if (!Utils.isValidUUID(uuid)) {
		return { statusCode: 400, data: `UUID ${ uuid } is not valid` }
	}
	const isDeleted: boolean = await usersDbService.deleteUser(uuid!);
	return isDeleted
		? { statusCode: 204 }
		: { statusCode: 404, data: `User with id ${ uuid } not found` };
}

export async function pageNotFoundController(): Promise<IControllerResponse> {
	return {
		statusCode: 404,
		data: 'Route not found',
	}
}
