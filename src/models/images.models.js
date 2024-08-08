import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "images";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

// Aplicar el plugin de paginación
imageSchema.plugin(mongoosePaginate);

export default mongoose.model(collection, imageSchema);
