import mongoose from "mongoose"
const Schema = mongoose.Schema
const CategorySchema = new Schema(
  {
    name: String,
    image: String,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

CategorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
export default mongoose.model("Category", CategorySchema)

