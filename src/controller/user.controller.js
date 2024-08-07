import { uploadImage } from "../utils/CloudinaryUtils.js";
import { AuthService } from "../services/auth.service.js";
import CustomError from "../services/error.custom.class.js";

const authService = new AuthService();

export const addProfileImg = async (req, res) => {
  try {
    const { id, image } = req.body;

    if (!image || !id) {
      throw new CustomError({
        message: "Imagen y ID de usuario son requeridos",
        code: 400,
        origin: "addProfileImg",
        isCustom: true,
      });
    }

    const match = /^data:image\/[a-zA-Z]+;base64,/.exec(image);
    if (!match) {
      throw new CustomError({
        message: "Formato de imagen no válido",
        code: 400,
        origin: "addProfileImg",
        isCustom: true,
      });
    }

    const base64Data = image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const publicId = `user-profile/${id}`;

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
        origin: "addProfileImg",
        isCustom: true,
      });
    }

    const updatedUser = await authService.findUserAndUpdate(id, {
      profileImage: optimizedUrl,
    });

    res.status(200).json({
      message: "Imagen actualizada exitosamente",
      user: updatedUser,
      image: optimizedUrl,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.error("Error al actualizar la imagen:", error.message);
    res.status(500).json({
      message: "Error al actualizar la imagen",
    });
  }
};

export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await authService.findUserById(id);
    if (!user) {
      throw new CustomError({
        message: "Usuario no encontrado",
        code: 404,
        origin: "getImageById",
        isCustom: true,
      });
    }

    if (!user.profileImage) {
      throw new CustomError({
        message: "Imagen no encontrada",
        code: 404,
        origin: "getImageById",
        isCustom: true,
      });
    }

    res.status(200).json({ image: user.profileImage });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.error("Error al obtener la imagen:", error.message);
    res.status(500).json({
      message: "Error al obtener la imagen",
    });
  }
};
