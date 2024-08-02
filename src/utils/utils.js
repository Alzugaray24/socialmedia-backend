export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
