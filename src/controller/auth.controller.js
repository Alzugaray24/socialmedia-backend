import CustomError from "../services/error.custom.class.js";
import { PRIVATE_KEY } from "../utils/utils.js";
import { AuthService } from "../services/auth.service.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../utils/utils.js";

const authService = new AuthService();

const registerUser = async (req, res) => {
  try {
    const { email, lastName, name, age, password, role } = req.body;

    const existingUser = await authService.findUser(email);
    if (existingUser) {
      throw new CustomError({
        message: "El email ya está en uso",
        code: 409,
        origin: "registerUser",
        isCustom: true,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      email,
      name,
      age,
      password: hashedPassword,
      role,
      lastName,
    };

    const savedUser = await authService.saveUser(newUser);

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      user: savedUser,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.error("Error durante el registro:", error.message);
    return res.status(500).json({
      message: "Ocurrió un error durante el registro",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.findUser(email);
    if (!user) {
      throw new CustomError({
        message: "Credenciales inválidas",
        code: 401,
        origin: "loginUser",
        isCustom: true,
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new CustomError({
        message: "Credenciales inválidas",
        code: 401,
        origin: "loginUser",
        isCustom: true,
      });
    }

    const token = generateToken(user._id, PRIVATE_KEY);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        age: user.age,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Ocurrió un error durante el inicio de sesión",
    });
  }
};

export { registerUser, loginUser };
