import User from "../models/auth.models.js";

export class AuthService {
  constructor() {}

  async findUser(email) {
    try {
      return await User.findOne({ email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findUserById(id) {
    try {
      const user = await User.findOne({ _id: id });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async saveUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findUserAndUpdate(id, updateData) {
    try {
      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
