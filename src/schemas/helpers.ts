import { Type } from "@sinclair/typebox";

/**
 * This function is used to create a standard enum type - typebox
 */
function StandardEnum<T extends Record<string, string>>(
	enumObj: T,
	options?: {
		defaultVal?: T[keyof T];
		description?: string;
		enum?: T[keyof T][];
	},
) {
	return Type.Unsafe<T[keyof T]>({
		type: 'string',
		enum: options?.enum || Object.values(enumObj),
		default: options?.defaultVal,
		description: options?.description,
	});
}

export { StandardEnum };