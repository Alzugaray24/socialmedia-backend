import dotenv from "dotenv";
import program from "../process.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mode = program.opts().mode;

let envFilePath;

switch (mode) {
  case "dev":
    envFilePath = path.resolve(__dirname, "../../.env.development");
    break;
  default:
    throw new Error("Invalid mode specified");
}

dotenv.config({ path: envFilePath });

export default {
  port: process.env.PORT,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  mongodbConnection: process.env.MONGODB_CONNECTION,
  privateKey: process.env.PRIVATE_KEY,
  dbName: process.env.DB_NAME,
};
