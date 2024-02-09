import { Utils } from '../../utils';
import * as path from 'node:path';
export const PATH_TO_DB = path.join(__dirname, '../users-db.json');

export function areRequiredUserFieldsValid(object: any): boolean {
	const requiredFieldsMapToType: Map<string, string> = new Map([
		['username', 'string'],
		['age', 'number'],
		['hobbies', 'array'],
	]);
	if (Object.keys(object).length !== requiredFieldsMapToType.size) {
		return false;
	}
	return Array.from(requiredFieldsMapToType.keys()).every((key: string) => {
		const isPresent: boolean = !!object[key];
		const type: string = requiredFieldsMapToType.get(key)!;
		const isTypeMatching: boolean = type === 'array'
			? Array.isArray(object[key])
			: typeof object[key] === type;
		return isPresent && isTypeMatching;
	})
}

export class User {
	public id: string = Utils.generateUUID();
	private username: string;
	private age: number;
	private hobbies: string[] = [];

	constructor(user: Partial<User>) {
		Object.assign(this, user);
	}
}
