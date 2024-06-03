import { HttpException, HttpStatus } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";

export const multerOptionsUserPhoto = {
    limits: {
        fileSize: 4*1024*1024, 
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype);
        
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: './uploads/user-photos',
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            const extentsion = extname(file.originalname)
            const filename = file.originalname.replace(extentsion,'')
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${generateRandomName(filename)}${extentsion}`);
        },
    }),
};
export const multerOptionsPostPhotos = {
    limits: {
        fileSize: 4*1024*1024, 
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        console.log(file.mimetype);
        
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: './uploads/post-photos',
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            const extentsion = extname(file.originalname)
            const filename = file.originalname.replace(extentsion,'')
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${generateRandomName(filename)}${extentsion}`);
        },
    }),
};

const generateRandomName = (filename:string):string =>{
    const date = new Date();
    const dateSalt = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
    const array = new Uint32Array(1);
    const randomSalt = crypto.getRandomValues(array)
    const fullSalt = dateSalt +'-'+randomSalt+'-'+filename
    return fullSalt
}