import { Type } from "@sinclair/typebox";

const successResponseSchema = Type.Object({
  msg: Type.String(),
});

const badRequestErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("BAD_REQUEST_ERROR"),
});

const forbiddenErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("FORBIDDEN_ERROR"),
});

const internalServerErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("INTERNAL_SERVER_ERROR"),
});

const notFoundErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("NOT_FOUND_ERROR"),
});

const unauthorizedErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("UNAUTHORIZED_ERROR"),
});

const conflictErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("CONFLICT_ERROR"),
});

const goneErrorSchema = Type.Object({
  msg: Type.String(),
  error: Type.Literal("GONE_ERROR"),
});

export {
  badRequestErrorSchema,
  conflictErrorSchema,
  forbiddenErrorSchema,
  goneErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  successResponseSchema,
  unauthorizedErrorSchema,
};
