import { type } from "arktype";
import {
  badRequestErrorSchema,
  conflictErrorSchema,
  forbiddenErrorSchema,
  goneErrorSchema,
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

function generateRequestParameters(schema: type, source: "query" | "path" , required = false) {
  const parameters: Array<{
    in: typeof source;
    name: string;
    schema: { type: string };
    required: boolean;
    description: string;
  }> = [];

  const schemaObj = schema.toJsonSchema() as { properties?: Record<string, unknown> };

  if (schemaObj?.properties) {
    for (const key of Object.keys(schemaObj.properties)) {
      parameters.push({
        in: source,
        name: key,
        schema: { type: "string" },
        required,
        description: `The ${key} parameter`,
      });
    }
  }

  return parameters;
}

function generateUpdateUserRequestBody() {
  return {
    required: true,
    description: "The user data to update",
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            first_name: { type: "string" },
            last_name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            phone_number: { type: "string" },
            profile_picture: {
              type: "string",
              format: "binary",
              description: "Profile picture image file (jpeg, png, jpg)",
            },
          },
        },
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
      case "403":
        responses[code] = generateJSONResponse(forbiddenErrorSchema, "Forbidden");
        break;
      case "404":
        responses[code] = generateJSONResponse(notFoundErrorSchema, "Not found");
        break;
      case "409":
        responses[code] = generateJSONResponse(conflictErrorSchema, "Conflict");
        break;
      case "410":
        responses[code] = generateJSONResponse(goneErrorSchema, "Gone");
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

export {
  generateJSONRequestBody,
  generateUpdateUserRequestBody,
  generateJSONResponse,
  getErrorResponses,
  getSecuritySchemes,
  generateRequestParameters,
};
