import mongoose from "mongoose";
import config from "../config/config.js";

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(config.mongodbConnection, {
      dbName: config.dbName,
    });
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.log("Conexión bbdd CREADA");
    } else {
      console.log("Conexión bbdd RECUPERADA");
    }

    return this.#instance;
  }
}
