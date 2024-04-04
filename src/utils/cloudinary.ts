import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET
});

const uploadImage = async (ImageData: Buffer): Promise<string> => {
  const base64Image = ImageData.toString("base64");
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { public_id: "user_image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          const url: any = result?.secure_url;
          resolve(url);
        }
      }
    );
  });
};

export default uploadImage;
