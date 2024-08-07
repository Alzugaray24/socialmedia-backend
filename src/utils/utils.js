import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

// Obtener __dirname en ES6
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../public/uploads"); // Combina __dirname con 'uploads'
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Error al cifrar la contraseña:", error.message);
    throw new Error("Error al cifrar la contraseña.");
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error al comparar las contraseñas:", error.message);
    throw new Error("Error al comparar las contraseñas.");
  }
};

export const generateToken = (user, privateKey, expiresIn = "1h") => {
  try {
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      privateKey,
      { expiresIn }
    );

    return token;
  } catch (error) {
    console.error("Error al generar el token JWT:", error.message);
    throw new Error("Error al generar el token.");
  }
};
