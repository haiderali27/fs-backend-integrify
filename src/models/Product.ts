import mongoose, { Document } from "mongoose";

export interface Product extends Document {
  title: string;
  description: string;
  price: number;
  images: [string];
  categoryId: mongoose.Types.ObjectId;
}

const ProductSchema = new mongoose.Schema<Product>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

ProductSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.category = returnedObject.categoryId;
    delete returnedObject.categoryId;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const ProductModel = mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
