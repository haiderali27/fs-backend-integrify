import express from "express";
import serverless from "serverless-http";
import "dotenv/config";

import itemsRoute from "../../src/routes/itemsRoute";
import categoryRoute from "../../src/routes/categoriesRoute";
import productsRoute from "../../src/routes/productsRoute";
import usersRoute from "../../src/routes/usersRoute";
import { loggingMiddleware } from "../../src/middlewares/logging";
import { routeNotFound } from "../../src/middlewares/routeNotFound";
import orderRoute from "../../src/routes/orderRoute";
import authRoute from "../../src/routes/authRoute";
import { checkAuth } from "../../src/middlewares/checkAuth";
import { responseHandler } from "../../src/middlewares/responsehandler";
import orderDetailsRoute from "../../src/routes/orderDetailsRoute";
const cors = require('cors');
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";
const api = express();

api.use(express.json());
api.use(cors());
//const router = express.Router();

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
  
  api.use('/', (req, res)=>{
    res.json('{"msg":"This is root route :), Welcome to the API" }')
  });

//api.use('/.netlify/functions/api', router)

export const handler = serverless(api);