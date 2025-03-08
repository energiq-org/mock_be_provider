/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { signupController, updateUserController } from "../controllers/users/index.ts";
import { addUserVehicleController } from "../controllers/users/userVehicles.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { profilePictureMiddleware } from "../middlewares/multer.ts";
import { arktypeRequestValidator } from "../middlewares/validator.ts";
import { signupSchema, updateUserSchema } from "../schemas/users.ts";
import { addVehicleSchema } from "../schemas/vehicles.ts";
const usersRouter = Router();

usersRouter.post("/signup", arktypeRequestValidator(signupSchema, "body"), signupController);

usersRouter.patch(
  "/",
  authMiddleware,
  profilePictureMiddleware,
  arktypeRequestValidator(updateUserSchema, "body"),
  updateUserController
);

usersRouter.post(
  "/vehicles",
  authMiddleware,
  arktypeRequestValidator(addVehicleSchema, "body"),
  addUserVehicleController
);

export { usersRouter };
