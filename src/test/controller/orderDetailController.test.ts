import request from "supertest";

import app from "../../";
import connect, { MongoHelper } from "../db-helper";

const BASE_URL = "/api/v1";
const ORDERDETAILS_URL = BASE_URL + "/orderDetails";
const USERS_URL = BASE_URL + "/users";
const ORDERS_URL = BASE_URL + "/orders";
const CATEGORIES_URL = BASE_URL + "/categories";
const PRODUCTS_URL = BASE_URL + "/products";

describe("OrderDetail controller", () => {
  let mongoHelper: MongoHelper;
  let userId: string;
  let orderId: string;
  let categoryId: string;
  let productId: string;
  let token: string;
  let commonHeaders={}
  beforeAll(async () => {
    mongoHelper = await connect();
    // create user
    // create order
    // create category
    // create product
    const userResponse = await request(app).post(USERS_URL).send({
      name: "Test cat",
      email: "test@g.com",
      password: "hello",
      role:"admin"
    });
    const response =  await request(app).post("/api/v1/auth/login").send({
      email:"test@g.com",
      password:"hello",
    });
    token = response.body.access_token;
    commonHeaders = { 
      "Authorization":`Bearer ${token}`,
    };
    //expect(userResponse.statusCode).toBe(201);
    userId = userResponse.body.id;
  

    const datee = new Date("2023-11-21T18:52:40.597Z");


    const orderResponse = await request(app).post("/api/v1/orders").send({
       totalAmount: 500, userId:userId, date:datee,
    });
    orderId = orderResponse.body.data.id
    //expect(orderResponse.statusCode).toBe(201);
  
    const categoryResponse = await request(app).post(CATEGORIES_URL).send({
      name: " Test cat",
    });

    
    //expect(categoryResponse.statusCode).toBe(201);
    categoryId = categoryResponse.body.id;
    const productResponse = await request(app).post(PRODUCTS_URL).set(commonHeaders).send({
      title: " Test cat",
      description: "Animal",
      price: 10.2,
      images: ["google.com"],
      categoryId: categoryId,
    });
   
    //expect(productResponse.statusCode).toBe(201);
    productId = productResponse.body.id;
  });
  afterEach(async()=>{
    await mongoHelper.clearDatabase();
  });
  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  async function createOrderDetail() {
    const response = await request(app).post(ORDERDETAILS_URL).send({
      _id: '6576a53f9fd68a3603971c8b',
      orderId: orderId,
      productId: productId,
      quantity: 230,
      priceAtPurchase: 200,
    });
    expect(response.statusCode).toBe(201);
   
    return response;
  }

  it("Should create a orderDetail", async () => {
    // no orders
    // create orders
    // get and check orders
    await createOrderDetail();
  });

  it("should get the orderDetail", async () => {
    // get a category
    //const response = await createOrderDetail();
    //const orderDetailId = response.body.id;
 
    const singleResponse = await request(app).get(
      ORDERDETAILS_URL + '/6576a53f9fd68a3603971c8b');
    expect(singleResponse.body.id).toEqual('6576a53f9fd68a3603971c8b');
  });

  it("should update the orderDetail", async () => {
    // update a category
    // create order
    // update
    // get and check
    const response = await createOrderDetail();
    const orderDetailId = response.body.id;
    const putResponse = await request(app)
      .put(ORDERDETAILS_URL + "/" + orderDetailId)
      .send({
        orderId: orderId,
        productId: productId,
        quantity: 120,
        priceAtPurchase: 130,
      });

    expect(putResponse.body.quantity).toEqual(120);
    expect(putResponse.body.priceAtPurchase).toEqual(130);
  });

  it("should delete the orderDetail", async () => {
    // create orderDetail
    // delete orderDetail
    // get and checkDetail
    const response = await createOrderDetail();
    const orderDetailId = response.body.id;
    const deleteResponse = await request(app).delete(
      ORDERDETAILS_URL + "/" + orderDetailId
    );
    expect(deleteResponse.body.id).toEqual(orderDetailId);
  });
});
