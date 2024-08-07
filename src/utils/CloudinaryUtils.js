// src/utils/cloudinaryUtils.js

import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dhmw3jd5q",
  api_key: "544944762894639",
  api_secret: "sNEhY2-sqbM3KKhjCkt3kTEfxlM",
});

/**
 * Sube una imagen a Cloudinary.
 * @param {string} image - La imagen en formato base64.
 * @param {string} publicId - El ID público para la imagen en Cloudinary.
 * @returns {Promise<object>} - Resultado de la carga.
 */
export const uploadImage = async (base64Image, publicId) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      public_id: publicId,
      resource_type: "image",
    });
    return uploadResult;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Obtiene la URL optimizada de una imagen.
 * @param {string} publicId - El ID público de la imagen.
 * @returns {string} - URL optimizada.
 */
export const getOptimizedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
  });
};
