import { type } from "arktype";
import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../schemas/common-responses.ts";

function generateJSONRequestBody(schema: type, description?: string) {
  return {
    description,
    required: true,
    content: {
      "application/json": {
        schema: schema.toJsonSchema(),
      },
    },
  };
}

function generateJSONResponse(schema: type, description?: string) {
  return {
    description,
    content: {
      "application/json": {
        schema: schema.toJsonSchema(),
      },
    },
  };
}

function getErrorResponses(codes: string[]) {
  const responses = {};
  for (const code of codes) {
    switch (code) {
      case "400":
        responses[code] = generateJSONResponse(badRequestErrorSchema, "Bad request");
        break;
      case "401":
        responses[code] = generateJSONResponse(unauthorizedErrorSchema, "Unauthorized");
        break;
      case "404":
        responses[code] = generateJSONResponse(notFoundErrorSchema, "Not found");
        break;
      default:
        responses[code] = generateJSONResponse(internalServerErrorSchema, "Internal server error");
    }
  }
  return responses;
}

function getSecuritySchemes() {
  return [
    {
      BearerSecurityScheme: [],
    },
  ];
}

export { generateJSONRequestBody, generateJSONResponse, getErrorResponses, getSecuritySchemes };
