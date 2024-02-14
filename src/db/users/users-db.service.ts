import { DbService } from '../db.service';
import { PATH_TO_DB, User } from './users-db.models';

export class UsersDbService extends DbService<User> {
	constructor(
	) {
		super(PATH_TO_DB);
	}

	public async getAllUsers(): Promise<User[]> {
		return this.loadDB();
	}

	public async getAllUsersByUUID(uuid: string): Promise<User | undefined> {
		const allUsers: User[] = await this.getAllUsers();
		return allUsers.find(({ id }: User) => id === uuid);
	}

	public async createUser(body: any): Promise<User> {
		const newUser: User = new User(body);
		const allUsers: User[] = await this.getAllUsers();
		await this.writeToDB([
			...allUsers,
			newUser,
		])
		return newUser;
	}

	public async updateUser(uuid: string, body: any): Promise<User | undefined> {
		const allUsers: User[] = await this.getAllUsers();
		let userToUpdate: User | undefined = allUsers.find(({ id }: User) => id === uuid);
		if (!userToUpdate) {
			return;
		}
		userToUpdate = new User({
			...userToUpdate,
			...body,
		});
		const updatedUsers: User[] = allUsers.map((user: User) => {
			return user.id === uuid
				? userToUpdate!
				: user;
		});
		await this.writeToDB(updatedUsers);
		return userToUpdate;
	}

	public async deleteUser(uuid: string): Promise<boolean> {
		const allUsers: User[] = await this.getAllUsers();
		const updatedUsers: User[] = allUsers.filter(({ id }: User) => id !== uuid);
		await this.writeToDB(updatedUsers);
		return allUsers.length !== updatedUsers.length;
	}

	protected typeObject(object: Object): User {
		return new User(object);
	}
}
