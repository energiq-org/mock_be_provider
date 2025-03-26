const OAuth2SecurityScheme: SecuritySchemeObject = {
  type: "oauth2",
  flows: {
    password: {
      tokenUrl: "http://localhost:8000/api/v1/auth/login",
      refreshUrl: "http://localhost:8000/api/v1/auth/refresh",
      scopes: {},
    },
  },
};

const BearerSecurityScheme: SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Get the access token from the login endpoint and insert it here",
  name: "Authorization",
  in: "header",
};

export { BearerSecurityScheme, OAuth2SecurityScheme };
