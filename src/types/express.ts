/* eslint-disable @typescript-eslint/no-empty-object-type */
import { UUID } from "crypto";
import { Response } from "express";

interface AuthorizedResponse extends Response<unknown, { userId: UUID }> {}
export { AuthorizedResponse };
