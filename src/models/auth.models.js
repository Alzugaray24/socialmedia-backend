import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "users";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  profileImage: {
    type: String,
    default: "",
  },
  last_connection: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Aplicar el plugin de paginación
userSchema.plugin(mongoosePaginate);

export default mongoose.model(collection, userSchema);
