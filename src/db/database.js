import mongoose from "mongoose";

export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(
      "mongodb+srv://CoderUser:QPPlb4bmNN9gkQKk@codercluster.tnznf0l.mongodb.net/CoderCluster?retryWrites=true&w=majority",
      {
        dbName: "socialmedia",
      }
    );
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
