import multer from "multer";

const fileFilter = (req: any, file: any, cb: any) => cb(null, true);

const multerupload = multer({ fileFilter });
export default multerupload;
