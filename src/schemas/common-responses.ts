import { type } from "arktype";

const SuccessResponseSchema = type({
  msg: "string",
});

const BadRequestErrorSchema = type({
  msg: type.string,
  error: "'BAD_REQUEST_ERROR'",
});

const ForbiddenErrorSchema = type({
  msg: type.string,
  error: "'FORBIDDEN_ERROR'",
});

const InternalServerErrorSchema = type({
  msg: type.string,
  error: "'INTERNAL_SERVER_ERROR'",
});

const NotFoundErrorSchema = type({
  msg: type.string,
  error: "'NOT_FOUND_ERROR'",
});

const UnauthorizedErrorSchema = type({
  msg: type.string,
  error: "'UNAUTHORIZED_ERROR'",
});

export {
  BadRequestErrorSchema,
  ForbiddenErrorSchema,
  InternalServerErrorSchema,
  NotFoundErrorSchema, SuccessResponseSchema, UnauthorizedErrorSchema
};

