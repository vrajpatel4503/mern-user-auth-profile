import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.log(`File not found for upload: ${localFilePath}`);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the temp file using async method
    await fs.promises.unlink(localFilePath);
    // console.log("Temp file deleted successfully");

    return response;
  } catch (error) {
    console.log(`Error in uploading to Cloudinary: ${error.message}`);

    if (fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
      // console.log("Temp file deleted after failure");
    }

    return null;
  }
};

export default uploadOnCloudinary;
