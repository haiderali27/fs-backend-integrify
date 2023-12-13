import ProductRepo from "../models/Product";
import { Product } from "../types/products";

async function paginateProducts(pageNumber: number, pageSize: number, title:string, categoryId:any, min_price:Number, max_price:Number) {
  const skip = (pageNumber - 1) * pageSize;
  const regex = new RegExp(`^${title}`, 'i');
  //const products = await ProductRepo.find({title:title}).skip(skip).limit(pageSize).populate('categoryId').exec();
  if(categoryId){
    const products = await ProductRepo.find({ title: { $regex: regex }, categoryId:categoryId,  price: { $gte: min_price, $lte: max_price }  }).skip(skip).limit(pageSize).populate('categoryId').exec();
    return products;
  }
  const products = await ProductRepo.find({ title: { $regex: regex },  price: { $gte: min_price, $lte: max_price }  }).skip(skip).limit(pageSize).populate('categoryId').exec();
  return products;
}

async function findAll() {
  const products = await ProductRepo.find().populate('categoryId').exec();
  return products;
}

async function findOne(productId: string) {
  const product = await ProductRepo.findById(productId).populate('categoryId').exec();
  return product;
}

async function findByTitle(title: string) {
  const product = await ProductRepo.find({title: title}).populate('categoryId').exec();
  return product;
}

async function createOne(product: Product, categoryId: string) {
  product.categoryId = categoryId;
  const newProduct = new ProductRepo(product);
  return await newProduct.save();
}

async function updateOne(productId: string, updatedProduct: Product, categoryId: string) {
  updatedProduct.categoryId = categoryId;
  const product = await ProductRepo.findByIdAndUpdate(productId, updatedProduct, { new: true }).populate('categoryId').exec();
  return product;
}

async function deleteOne(productId: string) {
  const product = await ProductRepo.findByIdAndDelete(productId).populate('categoryId').exec();
  return product;
}

export default {
  findOne,
  findByTitle,
  findAll,
  createOne,
  updateOne,
  deleteOne,
  paginateProducts,
};
