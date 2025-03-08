import { type } from "arktype";

const successResponseSchema = type({
  msg: "string",
});

const badRequestErrorSchema = type({
  msg: type.string,
  error: "'BAD_REQUEST_ERROR'",
});

const forbiddenErrorSchema = type({
  msg: type.string,
  error: "'FORBIDDEN_ERROR'",
});

const internalServerErrorSchema = type({
  msg: type.string,
  error: "'INTERNAL_SERVER_ERROR'",
});

const notFoundErrorSchema = type({
  msg: type.string,
  error: "'NOT_FOUND_ERROR'",
});

const unauthorizedErrorSchema = type({
  msg: type.string,
  error: "'UNAUTHORIZED_ERROR'",
});

const conflictErrorSchema = type({
  msg: type.string,
  error: "'CONFLICT_ERROR'",
});

export {
  badRequestErrorSchema,
  conflictErrorSchema,
  forbiddenErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  successResponseSchema,
  unauthorizedErrorSchema,
};
