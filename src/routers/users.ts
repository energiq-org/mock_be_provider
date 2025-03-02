/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { body } from "express-validator";
import { signupController } from "../controllers/users/signup";
import { addUserVehicleController } from "../controllers/users/userVehicles";
import { updateUserController } from "../controllers/users/update";
import { authMiddleware } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validator";
import { profilePictureMiddleware } from "../middlewares/multer";

const usersRouter = Router();

usersRouter.post(
  "/signup",
  [
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("Invalid First Name")
      .trim(),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isString()
      .withMessage("Invalid Last Name")
      .trim(),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email").trim(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
  ],
  validateRequest,
  signupController
);

usersRouter.post(
  "/vehicles",
  body("vehicle_id").isInt().withMessage("vehicle_id is required"),
  authMiddleware,
  validateRequest,
  addUserVehicleController
);

usersRouter.patch(
  "/",
  authMiddleware,
  profilePictureMiddleware,
  [
    body("first_name")
      .optional()
      .isString()
      .withMessage("Invalid First Name")
      .trim(),
    body("last_name")
      .optional()
      .isString()
      .withMessage("Invalid Last Name")
      .trim(),
    body("email").optional().isEmail().withMessage("Invalid Email").trim(),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long"),
    body("phone_number")
      .trim()
      .optional()
      .matches(/^\+?(\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)
      .withMessage("Please provide a valid phone number"),
  ],
  validateRequest,
  updateUserController
);

export { usersRouter };
