import { Router } from "express";
import * as console from "node:console";

const paymentRouter = Router();

paymentRouter.post("/", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  console.log(req.body);
  res.status(200).send({requestBody: req.body, msg: "Payment processed successfully"});
});

paymentRouter.get("/create", (req, res) => {
  res.status(201).json({ msg: "Payment created successfully" });
});

export { paymentRouter };
