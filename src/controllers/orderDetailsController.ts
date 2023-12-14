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
  //next(ResponseHandler.resourceFetched(JSON.stringify(list)));
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
  console.log('#ORDERDETAIL#######', orderDetail)
  if (!orderDetail) {
    next(ApiError.resourceNotFound("OrderDetail not found."));
    return;
  }
  //next(ResponseHandler.resourceFetched(JSON.stringify(orderDetail)));
  next(ResponseData.fetchResource(200, orderDetail));

}

async function createOneOrderDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const newOrderDetail = req.body;
  const orderDetail = await orderDetailService.createOne(newOrderDetail);

 // next(
  //  ResponseHandler.resourceCreated(
   //   JSON.stringify(orderDetail),
   //   `Order Detail with ${orderDetail._id} has been added`
   // )
   //);
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

  //next(
  //  ResponseHandler.resourceUpdated(
  //    JSON.stringify(updatedOrderDetail),
  //    `OrderDetail with ${updatedOrderDetail._id} has been updated`
  // )
  //);
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

 // next(
  //  ResponseHandler.resourceDeleted(
  //    JSON.stringify(deletedOrderDetail),
  //    `OrderDetail with ${deletedOrderDetail._id} has been deleted`
   // )
  //);
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
