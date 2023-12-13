import request from "supertest";

import app from "../../";
import connect, { MongoHelper } from "../db-helper";
import { number, object, string } from "zod";

describe("Category controller", () => {
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    //await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  it("Should create a category", async () => {

    const response = await request(app).post("/api/v1/categories").send({
      _id:  "655e1356be9cf967bdead01f", name: "Test cat", image:"https://i.imgur.com/QkIa5tT.jpeg"
    });

    expect(response.body).toHaveProperty("name");
    //expect(response.body.name).toMatchObject('Test cat');
    expect(response.body.name).toEqual('Test cat');
    
    expect(response.body).toEqual({
      name: "Test cat",
      image: expect.any(String),
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      id:  expect.any(String),
      //id:  "655e1356be9cf967bdead01f",
      
    });
  });



  it("should get the category", async () => {
    // get a category
    const response = await request(app).get("/api/v1/categories/655e1356be9cf967bdead01f");
    expect(response.body).toMatchObject({
      id:  "655e1356be9cf967bdead01f",
    });
  });

    it("should update the category", async () => {
      // update a category
      let category:any = {name: "Updated Category"}
  
      const response = await request(app).put("/api/v1/categories/655e1356be9cf967bdead01f").send({
         name: "Updated cat",
      });;
        
    expect(response.body).toEqual({
      name: "Updated cat",
      image: expect.any(String),
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      id:  expect.any(String),
      
    });
    });

    it("should delete the category", async () => {
      const response = await request(app).delete("/api/v1/categories/655e1356be9cf967bdead01f");
    expect(response.body.id).toEqual(
     "655e1356be9cf967bdead01f");
    });


});


