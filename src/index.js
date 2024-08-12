import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import MongoSingleton from "./db/database.js";
import userRouter from "./routes/user.router.js";
import imageRouter from "./routes/image.routes.js";
import config from "./config/config.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const MAX_REQUEST_SIZE = "10mb";

app.use(cors(corsOptions));
app.use(express.json({ limit: MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/images", imageRouter);

MongoSingleton.getInstance();

app.listen(config.port, () => {
  console.log(`Servidor activo en el puerto ${config.port}`);
});
