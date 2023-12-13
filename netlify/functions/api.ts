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
const { MongoClient } = require('mongodb');


api.use(express.json());
api.use(cors());
//const router = express.Router();

if (process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "PRODUCTION") {
    const mongoURL = process.env.DB_URL as string;
    //mongoose.connect(mongoURL).then(() => console.log("Connected!"));
    const client = new MongoClient(mongoURL);
    module.exports.handler = async function () {
      const databases = await client.db('admin').command({ listDatabases: 1 });
      return {
        statusCode: 200,
        databases: databases
      };
    };
  }
  
  api.get("/hello", loggingMiddleware, (_, res) => {
    res.json({ msg: "hello, from Express.js!" });
  });

  api.get('/', (req, res)=>{
    res.json('{"msg":"This is root route :), Welcome to the API" }')
  });

  
  api.use("/items", itemsRoute);
  api.use("/products", productsRoute);
  api.use("/categories", categoryRoute);
  api.use("/users", usersRoute);
  api.use("/orders", orderRoute);
  api.use("/orderDetails", orderDetailsRoute);
  api.use("/auth", authRoute);
  
  
  api.use(responseHandler);
  api.use(routeNotFound);
  

//api.use('/.netlify/functions/api', router)


export const handler = serverless(api);

