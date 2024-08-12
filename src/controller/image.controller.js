import { uploadImage } from "../utils/CloudinaryUtils.js";
import { AuthService } from "../services/auth.service.js";
import CustomError from "../services/error.custom.class.js";
import Image from "../models/images.models.js";
import { getImageUrlsByIds } from "../utils/utils.js";
import { deleteImageFromCloud } from "../utils/CloudinaryUtils.js";
import { UserService } from "../services/user.service.js";

const authService = new AuthService();
const userService = new UserService();

export const addImage = async (req, res) => {
  try {
    const { id, image, description } = req.body;

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

    console.log(publicId);

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
      description: description || "", // Guardar la descripción si existe
      publicId: publicId, // Añadir el publicId a la imagen
    });

    await newImage.save();

    // Pushear el ObjectId de la nueva imagen al arreglo de imágenes del usuario
    user.images.push(newImage._id);
    const updatedUser = await user.save();

    console.log("public", publicId);

    res.status(200).json({
      message: "Imagen subida y agregada exitosamente",
      user: updatedUser,
      image: {
        url: optimizedUrl,
        description: newImage.description,
        id: newImage._id,
        publicId: publicId,
      },
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

export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { userId } = req.query;

    if (!imageId || !userId) {
      throw new CustomError({
        message: "ID de imagen y ID de usuario son requeridos",
        code: 400,
        origin: "deleteImage",
        isCustom: true,
      });
    }

    // Buscar la imagen en la base de datos
    const image = await Image.findById(imageId);
    if (!image) {
      throw new CustomError({
        message: "Imagen no encontrada",
        code: 404,
        origin: "deleteImage",
        isCustom: true,
      });
    }

    console.log(image);

    // Eliminar la imagen del almacenamiento en la nube
    await deleteImageFromCloud(image.publicId);

    // Eliminar la imagen de la base de datos
    await Image.findByIdAndDelete(imageId);

    // Buscar al usuario para actualizar su arreglo de imágenes
    const user = await userService.findById(userId);
    if (!user) {
      throw new CustomError({
        message: "Usuario no encontrado",
        code: 404,
        origin: "deleteImage",
        isCustom: true,
      });
    }

    // Eliminar la referencia a la imagen del usuario
    user.images = user.images.filter(
      (imgId) => imgId.toString() !== imageId.toString()
    );

    await user.save();

    res.status(200).json({
      message: "Imagen eliminada exitosamente",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.error("Error al eliminar la imagen:", error.message);
    res.status(500).json({
      message: "Error al eliminar la imagen",
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

    const images = await getImageUrlsByIds(user.images);

    const response = images.map((image) => ({
      id: image._id.toString(),
      url: image.url,
      description: image.description,
      publicId: image.publicId,
    }));

    console.log(response);

    res.status(200).json({
      success: true,
      images: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las imágenes del usuario",
      origin: "getAllUserImages",
      isCustom: true,
      error: error.message,
    });
  }
};
