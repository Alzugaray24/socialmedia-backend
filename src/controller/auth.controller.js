import User from "../models/auth.models.js";
import bcrypt from "bcrypt";
import CustomError from "../services/error.custom.class.js";
import { PRIVATE_KEY } from "../utils/utils.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { email, name, age, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError({
        message: "El email ya esta uso",
        code: 409,
        origin: "registerUser",
        isCustom: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      age,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    return res.status(500).json({
      message: "An error occurred during registration",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("entre aca");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError({
        message: "Credenciales inválidas",
        code: 401,
        origin: "loginUser",
        isCustom: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError({
        message: "Credenciales inválidas",
        code: 401,
        origin: "loginUser",
        isCustom: true,
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.code).json({ message: error.message });
    }

    console.log(error);

    return res.status(500).json({
      message: "Ocurrió un error durante el inicio de sesión",
    });
  }
};

export { registerUser, loginUser };
