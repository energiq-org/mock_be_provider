import { type, Type } from "arktype";

function validateArkTypeSchema(input: unknown, schema: Type): { isValid: boolean; message?: string } {
  const validationResult = schema(input);
  if (validationResult instanceof type.errors) {
    return { isValid: false, message: validationResult.summary };
  }
  return { isValid: true };
}

export { validateArkTypeSchema };
