import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePaath) => {
    try {
        if (!localFilePaath) return null;

        const respone = await cloudinary.uploader.upload(localFilePaath, {
            resource_type: "auto"
        });

        console.log(respone);

        return respone;
        
    } catch (error) {
        fs.unlinkSync(localFilePaath);
        return null;
    }
};

export {uploadOnCloudinary};