import { Router } from "express";
import { helloController } from "../controllers/greeting";

const helloRouter: Router = Router();

helloRouter.get("/hello", helloController);

export { helloRouter };
