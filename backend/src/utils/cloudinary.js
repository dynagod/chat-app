import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { defaultProfileImage } from '../constants.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const respone = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);

        return respone;
        
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

const destroyOnCloudinary = async (cloudinaryImagePath) => {
    try {
        if (!cloudinaryImagePath) return null;

        if (cloudinaryImagePath === defaultProfileImage) return null;

        const imgageName = cloudinaryImagePath.split("/").at(-1).split(".").at(0);

        await cloudinary.uploader.destroy(imgageName);
    } catch (error) {
        return null;
    }
};

export { uploadOnCloudinary, destroyOnCloudinary };