import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (
  buffer,
  resourceType = "auto",
  format = null
) => {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "chat_files",
          resource_type: resourceType,
          ...(format ? { format } : {}),
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