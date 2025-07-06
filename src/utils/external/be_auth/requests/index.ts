// User management
export * from "./getUser.js";
export * from "./signup.js";
export * from "./updateUser.js";

// Export all request functions with aliases for convenience
export { getUser } from "./getUser.js";
export { signup as signupUser } from "./signup.js";
export { updateUser as updateAuthUser } from "./updateUser.js";
