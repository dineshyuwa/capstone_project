import * as path from "path";

const generateUniqueFilename = (originalFilename: string) => {
    const timestamp = new Date().getTime(); 
    const uniqueString = Math.random().toString(36).substring(7); 
    const fileExtension = path.extname(originalFilename); 
    const uniqueFilename = `${timestamp}_${uniqueString}${fileExtension}`;
    return uniqueFilename;
};

export default generateUniqueFilename;