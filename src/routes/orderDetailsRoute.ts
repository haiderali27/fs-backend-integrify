import express from "express";

import OrderDetailController from "../controllers/orderDetailsController";
import { validateOrderDetail } from "../middlewares/orderDetailValidate";

const router = express.Router();

router.get("/", OrderDetailController.findAllOrderDetail);
router.get("/:orderDetailId", OrderDetailController.findOneOrderDetail);
router.get("/offset", OrderDetailController.findOrderDetailOffset);
router.post(
  "/",
  validateOrderDetail,
  OrderDetailController.createOneOrderDetail
);
router.put(
  "/:orderDetailId",
  validateOrderDetail,
  OrderDetailController.findOneAndUpdate
);
router.delete("/:orderDetailId", OrderDetailController.findOneAndDelete);

export default router;
