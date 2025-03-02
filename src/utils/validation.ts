import { type } from "arktype";

function validateArkTypeSchema(input: unknown, schema: type): { isValid: boolean; message?: string } {
  const validationResult = schema(input);
  if (validationResult instanceof type.errors) {
    return { isValid: false, message: validationResult.summary };
  }
  return { isValid: true };
}

export { validateArkTypeSchema };
