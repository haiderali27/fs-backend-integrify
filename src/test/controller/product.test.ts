import request from "supertest";
import app from "../../";
 import connect, { MongoHelper } from '../db-helper';
 import mongoose from 'mongoose';
  let token: string;
  let commonHeaders={}
  describe("Product controller", () => {
    let mongoHelper: MongoHelper;

    beforeAll(async () => {
      mongoHelper = await connect();

      await request(app).post("/api/v1/users").send({
        _id: "655e2273fe4c4f58b6a80113", 
        name: "Test user", 
        email:"test@gmail.com",
        password:"12345",
        role:"admin"
    });

    const response =  await request(app).post("/api/v1/auth/login").send({
      email:"test@gmail.com",
      password:"12345",
    });
      token = response.body.access_token;
      commonHeaders = { 
        "Authorization":`Bearer ${token}`,
      };
    });
  
    afterEach(async () => {
      //await mongoHelper.clearDatabase();
    });
  
    afterAll(async () => {
      await mongoHelper.closeDatabase();
    });


  it("Should create a product", async () => {
 

    const response = await request(app).post("/api/v1/products").set(commonHeaders).send({
      _id: "655e78935512aa4109537c03",
      title: "Smartphone",
      description: "High-end smartphone with advanced features",
      price: 799.99,
      images: ["https://example.com/smartphone.jpg"],
      categoryId: "654e9ddac9cca8d8e6641666",
    });

    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toEqual("Smartphone");
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toEqual(
      "High-end smartphone with advanced features"
    );
    expect(response.body).toHaveProperty("price");
    expect(response.body.price).toEqual(799.99);
    expect(response.body).toHaveProperty("images");
    expect(response.body.images[0]).toEqual(
      "https://example.com/smartphone.jpg"
    );
    expect(response.body).toHaveProperty("category");
    expect(response.body.category).toEqual(
      "654e9ddac9cca8d8e6641666"
    );
  });

  it("Should get the product", async () => {
    const response = await request(app).get(
      "/api/v1/products/655e78935512aa4109537c03"
    );


    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toEqual("Smartphone");
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toEqual(
      "High-end smartphone with advanced features"
    );
    expect(response.body).toHaveProperty("price");
    expect(response.body.price).toEqual(799.99);
    expect(response.body).toHaveProperty("images");
    expect(response.body.images[0]).toEqual(
      "https://example.com/smartphone.jpg"
    );
    expect(response.body).toHaveProperty("category");
  });

  it("Should update the product", async () => {
    const response = await request(app)
      .put("/api/v1/products/655e78935512aa4109537c03").set(commonHeaders)
      .send({
        title: "Updated Smartphone",
        description: "Updated description for the smartphone",
        price: 899.99,
        images: ["https://example.com/updated-smartphone.jpg"],
        categoryId: "655e9e08106158f8d895ccbe",
      });

    expect(response.body).toHaveProperty("title");
    expect(response.body.title).toEqual("Updated Smartphone");
    expect(response.body).toHaveProperty("description");
    expect(response.body.description).toEqual(
      "Updated description for the smartphone"
    );
    expect(response.body).toHaveProperty("price");
    expect(response.body.price).toEqual(899.99);
    expect(response.body).toHaveProperty("images");
    expect(response.body.images[0]).toEqual(
      "https://example.com/updated-smartphone.jpg"
    );
    expect(response.body).toHaveProperty("category");
  });

  it("Should delete the product", async () => {
    const response = await request(app).delete(
      "/api/v1/products/655e78935512aa4109537c03"
    ).set(commonHeaders);

    const responseBody = JSON.parse(response.text);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toEqual("655e78935512aa4109537c03");


  });
});

