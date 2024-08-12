// src/utils/cloudinaryUtils.js

import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
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

/**
 * Elimina una imagen de Cloudinary.
 * @param {string} publicId - El ID público de la imagen a eliminar.
 * @returns {Promise<object>} - Resultado de la eliminación.
 */
export const deleteImageFromCloud = async (publicId) => {
  try {
    const deleteResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return deleteResult;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
