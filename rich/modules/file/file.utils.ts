import { extname } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUtils {}




export const imageFileFilter = (req, file, callback) => {
        
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
};

export const editFileName = (req, file, callback) => {

        const name = new Date().getTime()
        const fileExtName = extname(file.originalname);
        const randomName = Array(4)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');


        callback(null, `${name}-${randomName}${fileExtName}`);

        return `${name}-${randomName}${fileExtName}`
};