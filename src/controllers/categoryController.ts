import { NextFunction, Request, Response } from "express";
import CategoryService from "../services/categoryService"
import { ApiError } from "../errors/ApiError";
import { ResponseData } from "../responses/ResponseData";

const CategoryController = {

  async getOffset(req:Request, res: Response, next:NextFunction)  {
      const pageNumber = Number(req.query.pageNumber) || 1;
      const pageSize = Number(req.query.pageSize) || 10;
      if(pageNumber<0){
        next(ApiError.internal("PageNumber Must be Non Negative"))
        return
      }
      const categories = await CategoryService.paginateCategories(pageNumber, pageSize);      
      next(ResponseData.fetchResource(200, categories))
      
  }
  ,
  async getAllCategories(req: Request, res: Response, next:NextFunction) {
    const categories = await CategoryService.findAll()
    next(ResponseData.fetchResource(200, categories))
  }
  ,
  async getCategoryById(req: Request, res: Response, next:NextFunction) {
    const categoryId = req.params.id;
    if(categoryId.length!==24){
      next(ApiError.internal("ID must be a 24 character hex string, 12 byte Uint8Array, or an integer"))
      return
    }
    const item = await CategoryService.findOne(categoryId)
    if (!item) {
      next(ApiError.resourceNotFound(`Category ${categoryId} is not found`))
      return 
    }
    next(ResponseData.fetchResource(200, item))

  }
  ,
  async createCategory(req: Request, res: Response, next:NextFunction) {
    const category = req.body;
    if(!category){
      next(ApiError.internal("Details are Required"))
    }
    const newCategory = await CategoryService.createOne(category)
    next(ResponseData.fetchResource(201, newCategory))

  }
  ,
  async updateCategory(req: Request, res: Response, next:NextFunction) {
    const categoryId = req.params.id;
    if(categoryId.length!==24){
      next(ApiError.internal("ID must be a 24 character hex string, 12 byte Uint8Array, or an integer"))
      return
      
    }

    const  name  = req.body;
    if(!name){
      next(ApiError.internal("Details are Required"))
      return
    }

    const category = await CategoryService.updateOne(categoryId, name);
    if (!category) {
      next(ApiError.resourceNotFound("Category not found"))
      return
    }
    next(ResponseData.fetchResource(200, category))
  }
  ,
  async deleteCategory(req: Request, res: Response, next:NextFunction) {
    const categoryId = req.params.id;
    if(categoryId.length!==24){
      next(ApiError.internal("ID must be a 24 character hex string, 12 byte Uint8Array, or an integer"))
      return
    }
    const category = await CategoryService.deleteOne(categoryId);

    if (!category) {
      next(ApiError.resourceNotFound("Category not found"))
      return
    }
    next(ResponseData.fetchResource(200, category))
  }
}
export default CategoryController;
