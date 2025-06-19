import { NextFunction, Request, Response } from "express";
import { TSchema } from "@sinclair/typebox";
import { Ajv } from "ajv";
import { Value } from "@sinclair/typebox/value";

const ajv = new Ajv({
    allErrors: true,
    coerceTypes: true,
});

const ajvRequestValidator =
    (schema: TSchema, source: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => {
        const validate = ajv.compile(schema);
        const valid = validate(req[source]);
        if (!valid) {
            const errors =
                validate.errors?.map((error) => ({
                    field: error.instancePath.replace("/", ""),
                    message: error.message,
                })) || [];

            return res.status(400).json({
                msg: "Validation failed",
                errors,
            });
        }

        req[source] = Value.Convert(schema, req[source]);
        next();
    };

export { ajvRequestValidator };
