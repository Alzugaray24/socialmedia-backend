import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import MongoSingleton from "./db/database.js";

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);

MongoSingleton.getInstance();

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
