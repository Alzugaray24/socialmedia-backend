import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import MongoSingleton from "./db/database.js";
import userRouter from "./routes/user.router.js";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Ajusta el límite de tamaño para las solicitudes JSON y urlencoded
const MAX_REQUEST_SIZE = "10mb"; // Ajusta el límite según tus necesidades

app.use(cors(corsOptions));
app.use(express.json({ limit: MAX_REQUEST_SIZE })); // Ajusta el límite para solicitudes JSON
app.use(express.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true })); // Ajusta el límite para solicitudes URL-encoded

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

MongoSingleton.getInstance();

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
