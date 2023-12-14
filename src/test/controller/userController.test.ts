import request from "supertest";

import app from "../..";
import connect, { MongoHelper } from "../db-helper";
import { number, string } from "zod";

describe("User controller", () => {
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

  it("Should create a user", async () => {
    const response = await request(app).post("/api/v1/users").send({
        _id: "655e2273fe4c4f58b6a80113", 
        name: "Test user", 
        email:"test@gmail.com",
        password:"test123",
        role:"admin"
    });
  console.log("###########################",response.body)
    expect(response.body).toHaveProperty("name");
    expect(response.body.name).toEqual('Test user');
    expect(response.body).toHaveProperty("email");
    expect(response.body.email).toEqual("test@gmail.com");
    expect(response.body).toHaveProperty("role");
    expect(response.body.role).toEqual("admin");
    // expect(response.body).toEqual({
    //   name: "Test user",
    //   email:"test@gmail.com",
    //   password:"test123",
    //   role:"User",
    //   //_id: expect.any(string),
    //   _id: "655e2273fe4c4f58b6a80113",
    //   __v: 0,
    // });
  });


// it("should get the user", async () => {
//     const response = await request(app).get("/api/v1/users/655e2273fe4c4f58b6a80113");
   
//     expect(response.body).toMatchObject({
//       _id: "655e2273fe4c4f58b6a80113",
//     });
//   });

});


