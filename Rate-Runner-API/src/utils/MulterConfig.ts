import multer from "multer";
import path from 'path';

const random = (digit = 10) => {
    const crypto = require("crypto");
    const id: string = crypto.randomBytes(digit).toString('hex');
    return id;
}

export const fileUploadOptions = {
    storage: multer.diskStorage({
        destination: (req: any, file: any, cb: any) => {
            const appDir = path.dirname(require.main.filename);
            cb(null, `${appDir}/upload`);
        },
        filename: (req: any, file: any, cb: any) => {
            const splitName = file.originalname.split('\.');
            const extfile = splitName[splitName.length - 1];
            cb(null, random() + "." + extfile);
        },
    })
}
