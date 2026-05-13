import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (
  buffer,
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "chat_files",
          resource_type: resourceType,
        },
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result);
        }
      );

    stream.end(buffer);
  });
};