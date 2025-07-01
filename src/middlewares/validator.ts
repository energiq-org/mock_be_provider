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
                validate.errors?.map((error) => {
                    const field = error.instancePath.substring(1).replace(/\//g, ".");
                    let message = error.message;

                    if (error.keyword === "pattern") {
                        const path = error.schemaPath.slice(2, -"/pattern".length).split("/");
                        let propertySchema: unknown = schema;
                        for (const segment of path) {
                            if (
                                typeof propertySchema === "object" &&
                                propertySchema !== null &&
                                segment in propertySchema
                            ) {
                                propertySchema = (propertySchema as Record<string, unknown>)[segment];
                            } else {
                                propertySchema = undefined;
                                break;
                            }
                        }
                        if (
                            typeof propertySchema === "object" &&
                            propertySchema !== null &&
                            "description" in propertySchema &&
                            typeof (propertySchema as { description: unknown }).description === "string"
                        ) {
                            message = (propertySchema as { description: string }).description;
                        }
                    }
                    return {
                        field,
                        message,
                    };
                }) || [];

            return res.status(400).json({
                errors,
            });
        }

        req[source] = Value.Convert(schema, req[source]);
        next();
    };

export { ajvRequestValidator };
