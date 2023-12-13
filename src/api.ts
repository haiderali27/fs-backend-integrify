import express from "express";
import serverless from "serverless-http";
import "dotenv/config";

import itemsRoute from "./routes/itemsRoute";
import categoryRoute from "./routes/categoriesRoute";
import productsRoute from "./routes/productsRoute";
import usersRoute from "./routes/usersRoute";
import { loggingMiddleware } from "./middlewares/logging";
import { routeNotFound } from "./middlewares/routeNotFound";
import orderRoute from "./routes/orderRoute";
import authRoute from "./routes/authRoute";
import { checkAuth } from "./middlewares/checkAuth";
import { responseHandler } from "./middlewares/responsehandler";
import orderDetailsRoute from "./routes/orderDetailsRoute";
const cors = require('cors');
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";
const api = express();

api.use(express.json());
api.use(cors());


if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "PRODUCTION") {
    const mongoURL = process.env.DB_URL as string;
    mongoose.connect(mongoURL).then(() => console.log("Connected!"));
  }
  
  api.get("/hello", loggingMiddleware, (_, res) => {
    res.json({ msg: "hello, from Express.js!" });
  });
  
  api.use("/api/v1/items", itemsRoute);
  api.use("/api/v1/products", productsRoute);
  api.use("/api/v1/categories", categoryRoute);
  api.use("/api/v1/users", usersRoute);
  api.use("/api/v1/orders", orderRoute);
  api.use("/api/v1/orderDetails", orderDetailsRoute);
  api.use("/api/v1/auth", authRoute);
  
  
  api.use(responseHandler);
  api.use(routeNotFound);
  


export const handler = serverless(api);