import openapi from "@wesleytodd/openapi";
import { BearerSecurityScheme, OAuth2SecurityScheme } from "./components.js";

const docs = openapi({
    openapi: "3.0.0",
    info: {
        title: "EnergiQ Dashboard APIs (Frontend-Used Endpoints)",
        version: "1.0.0",
        description: "EV Charging Station Management Platform - Dashboard, analytics, and sessions APIs that are actively used by the frontend application. This documentation only shows endpoints that the frontend calls, hiding unused CRUD operations for cleaner API documentation.",
    },
});

docs.securitySchemes("BearerSecurityScheme", BearerSecurityScheme);
docs.securitySchemes("OAuth2SecurityScheme", OAuth2SecurityScheme);

export { docs };
