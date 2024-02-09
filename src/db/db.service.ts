import * as fs from 'fs/promises';

export abstract class DbService<T> {
	protected abstract typeObject(object: Object): T;
	protected constructor(
		protected pathToDB: string,
	) {
	}

	protected async loadDB(): Promise<T[]> {
		const fileContent = await fs.readFile(this.pathToDB);
		const parsed = JSON.parse(fileContent.toString());
		return parsed.map((object: Object) => this.typeObject(object));
	}

	protected async writeToDB(collection: T[]): Promise<void> {
		const stringified = JSON.stringify(collection, null, 2);
		await fs.writeFile(this.pathToDB, stringified);
	}
}
