import mongoose from "mongoose";

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect("mongodb://localhost:27017/", {
      dbName: "socialmedia",
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
