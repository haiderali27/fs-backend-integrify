import { NextFunction, Request, Response } from "express";
import orderDetailService from "../services/orderDetailService";
import { ApiError } from "../errors/ApiError";
import { ResponseHandler } from "../responses/ResponeHandler";
import { ResponseData } from "../responses/ResponseData";

async function findOrderDetailOffset(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const list = await orderDetailService.getPaginatedOrderDetail(
    pageNumber,
    pageSize
  );
  next(ResponseData.fetchResource(200, list));

}

async function findAllOrderDetail(
  _: Request,
  res: Response,
  next: NextFunction
) {
  const orderDetails = await orderDetailService.findAll();
  next(ResponseHandler.resourceFetched(JSON.stringify(orderDetails)));
}

async function findOneOrderDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orderDetailId = req.params.orderDetailId;
  const orderDetail = await orderDetailService.findone(orderDetailId);
  if (!orderDetail) {
    next(ApiError.resourceNotFound("OrderDetail not found."));
    return;
  }
  next(ResponseData.fetchResource(200, orderDetail));

}

async function createOneOrderDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newOrderDetail = req.body;
  const orderDetail = await orderDetailService.createOne(newOrderDetail);
  next(ResponseData.fetchResource(201, orderDetail));

  
}

async function findOneAndUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newOrderDetail = req.body;
  const orderDetailId = req.params.orderDetailId;
  const updatedOrderDetail = await orderDetailService.findOneAndUpdate(
    orderDetailId,
    newOrderDetail
  );

  if (!updatedOrderDetail) {
    next(ApiError.resourceNotFound("OrderDetail not found."));
    return;
  }
  next(ResponseData.fetchResource(200, updatedOrderDetail));

}

async function findOneAndDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orderDetailId = req.params.orderDetailId;
  const deletedOrderDetail = await orderDetailService.findOneAndDelete(
    orderDetailId
  );

  if (!deletedOrderDetail) {
    next(ApiError.resourceNotFound("OderDetail not found."));
    return;
  }
  next(ResponseData.fetchResource(200, deletedOrderDetail));

}

export default {
  findOneOrderDetail,
  findAllOrderDetail,
  createOneOrderDetail,
  findOneAndUpdate,
  findOneAndDelete,
  findOrderDetailOffset,
};
