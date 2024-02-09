import * as crypto from 'node:crypto';

export class Utils {
	public static generateUUID() {
		return crypto.randomUUID();
	}

	public static isValidUUID(uuid?: string): boolean {
		if (!uuid) {
			return false;
		}
		const uuidRegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
		return uuidRegExp.test(uuid);
	}

	public static isMultiThreadArgvFlag(): boolean {
		const multiThreadArgvFlag: string = process.argv.slice(2)[0];
		return !!multiThreadArgvFlag && multiThreadArgvFlag === 'multiThread';
	}
}
