const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64-encoded image (data URL) to Cloudinary.
 *
 * @param {string} base64Image - e.g. "data:image/png;base64,iVBOR..."
 * @param {string} attemptId - used to namespace screenshots per attempt
 * @returns {Promise<{url: string, publicId: string}>}
 */
async function uploadScreenshot(base64Image, attemptId) {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: `visiontrace/${attemptId}`,
    resource_type: "image",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

module.exports = { uploadScreenshot };
