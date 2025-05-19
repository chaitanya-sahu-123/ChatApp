import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); 

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME); // ✅ Debugging log

const ENV = {
    CLOUDINARY_CLOUD_NAME: process.env?.CLOUDINARY_CLOUD_NAME || import.meta.env?.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env?.CLOUDINARY_API_KEY || import.meta.env?.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env?.CLOUDINARY_API_SECRET || import.meta.env?.CLOUDINARY_API_SECRET
};

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET
});

export default cloudinary;
