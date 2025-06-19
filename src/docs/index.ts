import openapi from "@wesleytodd/openapi";
import { BearerSecurityScheme, OAuth2SecurityScheme } from "./components.js";

const docs = openapi({
    openapi: "3.0.0",
    info: {
        title: "EnergiQ user APIs",
        version: "1.0.0",
        description: "EnergiQ user APIs",
    },
});

docs.securitySchemes("BearerSecurityScheme", BearerSecurityScheme);
docs.securitySchemes("OAuth2SecurityScheme", OAuth2SecurityScheme);
export { docs };
