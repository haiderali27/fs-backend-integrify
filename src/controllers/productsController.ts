import { NextFunction, Request, Response } from "express";
import ProductsService from "../services/productsService";
import { ApiError } from "../errors/ApiError";
import { Product } from "../types/products";
import { ResponseData } from "../responses/ResponseData";


const ProductController = {
  async findAllProduct(req: Request, res: Response, next:NextFunction) {
    try {
      const pageNumber = Number(req.query.offset) || 1;
      const pageSize = Number(req.query.limit) || 10;
      const title = String(req.query.title || '') 
      const categoryId = req.query.categoryId
      const min_price = Number(req.query.price_min) || 0
      const max_price = Number(req.query.price_max) || Number.MAX_VALUE

      const products = await ProductsService.paginateProducts(pageNumber, pageSize, title, categoryId, min_price, max_price);
      //res.json({ products });
      next(ResponseData.fetchResource(200, products))

    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async findByTitle(req: Request, res: Response) {
    try {
      const title = String(req.query.title);
      const products = await ProductsService.findByTitle(title);
      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async findOneProduct(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.productId;

    if(productId.length!==24){
      next(ApiError.internal("ID must be a 24 character hex string, 12 byte Uint8Array, or an integer"))
      return
    }

    const product = await ProductsService.findOne(productId);

    if (!product) {
      next(ApiError.resourceNotFound("Product not found."));
      return;
    }

    //res.json({ product });
    next(ResponseData.fetchResource(200, product))

  },

  async createOneProduct(req: Request, res: Response, next:NextFunction) {
    const newProduct: Product = req.body;
    const categoryId: string = req.body.categoryId;

    const product = await ProductsService.createOne(newProduct, categoryId);

    //res.status(201).json({ product });
    next(ResponseData.fetchResource(201, product))
 
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.productId;
    const updatedProduct: Product = req.body;
    const categoryId: string = req.body.categoryId;

    const product = await ProductsService.updateOne(productId, updatedProduct, categoryId);

    if (!product) {
      next(ApiError.resourceNotFound("Product not found."));
      return;
    }

    //res.json({ product });
    next(ResponseData.fetchResource(200, product))

  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.productId;
    const deletedProduct = await ProductsService.deleteOne(productId);

    if (!deletedProduct) {
      next(ApiError.resourceNotFound("Product not found."));
      return;
    }

    //res.json({ message: "Product deleted successfully" });
    next(ResponseData.fetchResource(200, deletedProduct))


  },
};

export default ProductController;