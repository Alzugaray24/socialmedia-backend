import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import MongoSingleton from "./db/database.js";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: "*", // Permitir todas las orígenes. Cambia esto para restringir a dominios específicos.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hola Mundo" });
});

MongoSingleton.getInstance();

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
