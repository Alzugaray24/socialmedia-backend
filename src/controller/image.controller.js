import { uploadImage } from "../utils/CloudinaryUtils.js";
import { AuthService } from "../services/auth.service.js";
import CustomError from "../services/error.custom.class.js";
import Image from "../models/images.models.js";
import { getImageUrlsByIds } from "../utils/utils.js";

const authService = new AuthService();

export const addImage = async (req, res) => {
  try {
    const { id, image } = req.body;

    if (!image || !id) {
      throw new CustomError({
        message: "Imagen y ID de usuario son requeridos",
        code: 400,
        origin: "addImage",
        isCustom: true,
      });
    }

    const match = /^data:image\/[a-zA-Z]+;base64,/.exec(image);
    if (!match) {
      throw new CustomError({
        message: "Formato de imagen no válido",
        code: 400,
        origin: "addImage",
        isCustom: true,
      });
    }

    const base64Data = image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const publicId = `user-posts/${id}/${Date.now()}`;

    const uploadResult = await uploadImage(
      `data:image/jpeg;base64,${base64Data}`,
      publicId
    );
    const optimizedUrl = uploadResult.secure_url;

    const user = await authService.findUserById(id);
    if (!user) {
      throw new CustomError({
        message: "Usuario no encontrado",
        code: 404,
        origin: "addImage",
        isCustom: true,
      });
    }

    // Crear y guardar la imagen en la colección de imágenes
    const newImage = new Image({
      url: optimizedUrl,
    });
    await newImage.save();

    console.log(newImage._id);

    // Pushear el ObjectId de la nueva imagen al arreglo de imágenes del usuario
    user.images.push(newImage._id);
    const updatedUser = await user.save();

    console.log("se pudo");

    res.status(200).json({
      message: "Imagen subida y agregada exitosamente",
      user: updatedUser,
      image: optimizedUrl,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.error("Error al agregar la imagen:", error.message);
    res.status(500).json({
      message: "Error al agregar la imagen",
    });
  }
};

export const getAllUserImages = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await authService.findUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        origin: "getAllUserImages",
        isCustom: true,
      });
    }

    const imageUrls = await getImageUrlsByIds(user.images); // Obtener URLs usando los IDs de imágenes

    console.log(imageUrls);
    res.status(200).json(imageUrls); // Enviar las URLs en la respuesta
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las imágenes del usuario",
      origin: "getAllUserImages",
      isCustom: true,
      error: error.message,
    });
  }
};
