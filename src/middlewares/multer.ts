import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

function profilePictureMiddleware(req: Request, res: Response, next: NextFunction) {
    const upload = multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            const allowedExtensions = [".png"];
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowedExtensions.includes(ext)) {
                cb(null, true);
            } else {
                return res.status(400).json({ message: "Invalid file type, only png files accepted." });
            }
        },
    }).single("profile_picture");
    if (req.headers["content-type"] !== undefined && req.headers["content-type"].includes("multipart/form-data")) {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: (err as Error).message });
            }
            next();
        });
    } else {
        next();
    }
}

export { profilePictureMiddleware };
