import User from "../models/auth.models.js";

export class UserService {
  constructor() {}

  async findUser(email) {
    try {
      return await User.findOne({ email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findById(id) {
    try {
      return await User.findOne({ _id: id });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
