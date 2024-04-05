/* eslint-disable func-names */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../app";
import { dbConnect } from "../config/db.config";
import User from "../models/user";
import Role from "../models/Role";
import { passwordEncrypt } from "../utils/encrypt";
import Product from "../models/Product";
import ProductCategory from "../models/product_category";
import { tokenVerify } from "../utils/token.generator";
import { DataInfo } from "../controllers/otpauth.controllers";

const imageFilePath = "./src/__test__/image/JobIcon.png";

const notAllowedFormat = "./src/__test__/image/svgrepo.svg";
const bigSizePicture = "./src/__test__/image/svgrepo.svg";

let productId: string;
let image_id: string;

let headerTokenSeller: string;
let verifyTkn: string;
let catId: string;
let headerToken: string;
let userId1: string;
chai.use(chaiHttp);

before(async function () {
  this.timeout(50000);
  await dbConnect();
  await ProductCategory.truncate({ cascade: true });
  await Product.truncate({ cascade: true });
  await Role.truncate({ cascade: true });
  await Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff331",
    name: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff332",
    name: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff333",
    name: "seller",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const createUsers = async () => {
    try {
      await User.truncate({ cascade: true });

      // Create first user
      const user1 = await User.create({
        firstName: "Ernest",
        lastName: "Tchami",
        password: await passwordEncrypt("Test@12345"),
        email: "usertest@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff331"
      });

      // Create second user
      const user2 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        email: "anotheruser@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff332"
      });
      const user3 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Seller1234@"),
        email: "anotheruser1@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });
      const user4 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        email: "anotheruser3@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });
      return [user1, user2, user3, user4];
    } catch (error) {
      console.error("Error creating users:", error);
    }
  };

  // Call the function to create users

  const users: any = await createUsers();
  userId1 = users[1].dataValues.id;
});

describe("test a user signup endpoint", () => {
  it("it should create a user successful", (done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: "emailfortest3@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(5000);

  it("should return user exist", (done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(409);
        done();
      });
  });
  it("it should test a user validation fail", (done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: "tchami123@gmaicom"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("user fail to verify user with invalid token", (done) => {
    chai
      .request(app)
      .get(
        "/api/users/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5OTRlZmRlLTEwYzAtNDhkNC1hNjEyLThiZDE0M2UxNDE0YiIsImVtYWlsIjoic2FiYXRvQGlnaWhlLnJ3IiwiaWF0IjoxNzEyMjA2NzY2LCJleHAiOjE3MTQ3OTg3NjZ9.-NHAR2uzikIfmPWuN0nx_smlx3NOFezcN2A32sxtJvU/verify-email"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
});
describe("user Signin controller and passport", () => {
  it("Login end point test", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        headerToken = res.body.token;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("Login s seller user point test", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Seller1234@",
        email: "anotheruser1@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        verifyTkn = res.body.token;
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(5000);
  it("Email sent successfully", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Seller1234@",
        email: "anotheruser1@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        verifyTkn = res.body.otpToken;
        expect(res.body.message).to.equal(
          "Verify with 2FA before access is granted"
        );
        done();
      });
  });
  it("should Validate otp input", async () => {
    let otpCode: string = "";
    const resultOtpToken = async (err: Error, data: DataInfo) => {
      const decoded = data;
      otpCode = decoded.body.otp;
      return decoded;
    };
    await tokenVerify(verifyTkn, resultOtpToken);
    chai
      .request(app)
      .post(`/api/users/otp/${verifyTkn}`)
      .send({ otp: `${otpCode}` })
      .end(async (err, res) => {
        headerTokenSeller = res.body.token;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Login seller successful");
        expect(res.body.token).to.be.undefined;
      });
  });

  it("should show 500 error in logining in the user", (done) => {
    const userStub = sinon
      .stub(User, "findOne")
      .throws(new Error("There is an error in login please try again"));
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        userStub.restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it("Login end Fail to login", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "tchdfjhdcjschscdcd7@gmail.com",
        password: "Test@12345"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });
  it("Login end Fail to login for password", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345bjhb",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      });
  });
  it("use invalid email", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "tchamiefuhh677gmail.com",
        password: "Test@12345123"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should respond with the welcome message", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should respond with the welcome message", (done) => {
    chai
      .request(app)
      .get("/")
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
    done();
  });
  it("check for the user profile", () => {
    chai
      .request(app)
      .get("/api/users/profile")
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  it("update user profile with unauthorized field", () => {
    chai
      .request(app)
      .put("/api/users/profiles")
      .set("Authorization", headerToken)
      .send({
        email: "Tdaniel@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("update user profile with an image", () => {
    chai
      .request(app)
      .put("/api/users/profiles")
      .set("Authorization", headerToken)
      .attach("profileImage", imageFilePath)
      .field("firstName", "Ernest")
      .field("lastName", "Tchami")
      .field("phone", "+250 74554545454")
      .field("birthDate", "03/12/2023")
      .field("preferredLanguage", "kinyarwanda")
      .field("whereYouLive", "kigali")
      .field("preferredCurrency", "dollar")
      .field("billingAddress", "kigali muhanga")
      .then((res) => {
        expect(res).to.have.status(201);
      })
      .catch((err) => {
        throw err;
      });
  });
  const wrongRoleId = "f11b7418-f367-4a11-bd7d-729e979ffbf9";
  let createdRoleId: any;
  // Create a role
  it("should create a new role", (done) => {
    chai
      .request(app)
      .post(`/api/roles/`)
      .set("Authorization", headerToken)
      .send({ name: "TestRole" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body)
          .to.have.property("message")
          .equal("Role created successfully");
        expect(res.body).to.have.property("newRole");
        createdRoleId = res.body.newRole.id;

        done();
      });
  }).timeout(5000);
  it("should create a new role and get server error ", (done) => {
    const roleStub = sinon
      .stub(Role, "create")
      .throws(new Error("Internal server error"));

    chai
      .request(app)
      .post(`/api/roles/`)
      .set("Authorization", headerToken)
      .send({ name: "PrinceROLEtEST" })
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
  it("should fail to create an existing role", (done) => {
    chai
      .request(app)
      .post(`/api/roles/`)
      .set("Authorization", headerToken)
      .send({ name: "TestRole" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(409);
        done();
      });
  });
  // Get all roles with server error
  it("should get all role with unauthenticated user ", (done) => {
    chai
      .request(app)
      .get(`/api/roles`)
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByaW5jZXJ3aWdpbWJhMDdAZ21haWwuY29tIiwiaWF0IjoxNzEyNTU3Mjk3LCJleHAiOjE3MTUxNDkyOTd9.LU_A0tnquBm8_UzqsP-jwxWeVT0-c8qL65uCwzTNc_0"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  // Get all roles
  it("should get all role", (done) => {
    chai
      .request(app)
      .get(`/api/roles`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        done();
      });
  });

  it("should update a role and get server error ", (done) => {
    const roleStub = sinon
      .stub(Role, "findByPk")
      .throws(new Error("Internal server error"));
    chai
      .request(app)
      .put(`/api/roles/${createdRoleId}`)
      .set("Authorization", headerToken)
      .send({ name: "UpdatedRoleName" })
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
  // Get all roles
  it("should ge", (done) => {
    chai
      .request(app)
      .get(`/api/roles`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        done();
      });
  });
  // Get role by unexisting id
  it("should get a role by unexisting ID", (done) => {
    chai
      .request(app)
      .get(`/api/roles/${wrongRoleId}`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  // Get role by ID
  it("should get a role by ID", (done) => {
    chai
      .request(app)
      .get(`/api/roles/${createdRoleId}`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("role");
        done();
      });
  });
  // Get role by ID
  it("should get a role by ID", (done) => {
    chai
      .request(app)
      .get(`/api/roles/${wrongRoleId}`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  it("should assign unexisting role to a user internal server", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId1}/roles`)
      .set("Authorization", headerToken)
      .send({ roleId: wrongRoleId })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });

  // Assign role to user
  it("should assign a role to a user", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId1}/roles`)
      .set("Authorization", headerToken)
      .send({ roleId: "8736b050-1117-4614-a599-005dd76ff331" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .equal("Role assigned to user successfully");
        done();
      });
  });
  it("getting all users", (done) => {
    chai
      .request(app)
      .get(`/api/users`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  // Update a role
  it("should update a role", (done) => {
    chai
      .request(app)
      .put(`/api/roles/${createdRoleId}`)
      .set("Authorization", headerToken)
      .send({ name: "UpdatedRoleName" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("role");
        done();
      });
  });
  // Update

  it("should update a role server error", (done) => {
    chai
      .request(app)
      .put(`/api/roles/f11b7418-f367-4a11-bd7d-729e979ffbf9bbbbbbb`)
      .set("Authorization", headerToken)
      .send({ name: "Updated" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);

        done();
      });
  });

  // Delete a role
  it("should delete a role", (done) => {
    chai
      .request(app)
      .delete(`/api/roles/${createdRoleId}`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body)
          .to.have.property("message")
          .equal("Role deleted successfully");
        done();
      });
    it("update user profile with an image", () => {
      chai
        .request(app)
        .put("/api/users/profiles")
        .set("Authorization", headerToken)
        .send({})
        .then((res) => {
          expect(res).to.have.status(400);
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  // test for creating product category --------------------------------------------------------------------

  it("it shoult test to list product categories but it is not created", (done) => {
    chai
      .request(app)
      .get("/api/categories")
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          "no Product category found , please add new"
        );
        expect(res).to.have.status(200);
        done();
      });
  });
  it("it shoult test product category creation", (done) => {
    chai
      .request(app)
      .post("/api/categories")
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT"
      })
      .end((err, res) => {
        expect(res.body.message).to.equal("Product category is created");
        expect(res).to.have.status(201);
        done();
      });
  });
  it("it shoult test to list product categories with success", (done) => {
    chai
      .request(app)
      .get("/api/categories")
      .set("Authorization", headerToken)

      .end((err, res) => {
        catId = res.body.categories[0].id;

        expect(res.body.message).to.equal("success");
        expect(res).to.have.status(200);
        done();
      });
  });
  it("it shoult test getting single product category", (done) => {
    chai
      .request(app)
      .get(`/api/categories/${catId}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.message).to.equal("success");
        expect(res).to.have.status(200);
        done();
      });
  });
  it("it shoult test getting unexisting product category  ", (done) => {
    chai
      .request(app)
      .get(`/api/categories/d62aa7d1-23b3-437b-8407-adaf24b3eb4c`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.error).to.equal(
          "The product category is not found , please try again"
        );
        expect(res).to.have.status(404);
        done();
      });
  });
  it("it shoult test getting product category internal error ", (done) => {
    chai
      .request(app)
      .get(`/api/categories/d62aa7d1-23b3-437b-8407-adaf24b3eb4chhhhhhgg`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
  it("it shoult test product category with existing name ", (done) => {
    chai
      .request(app)
      .post("/api/categories")
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT"
      })
      .end((err, res) => {
        expect(res.body.message).to.equal("This Category alread exists");
        expect(res).to.have.status(409);
        done();
      });
  });
  it("it shoult test product category  with validation fail", (done) => {
    chai
      .request(app)
      .post("/api/categories")
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT@@@"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("it shoult test product category update ", (done) => {
    chai
      .request(app)
      .patch(`/api/categories/${catId}`)
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT UPDATE"
      })
      .end((err, res) => {
        expect(res.body.message).to.equal(
          "Product category updated successful"
        );
        expect(res).to.have.status(200);
        done();
      });
  });
  it("it shoult test product category update validation fail ", (done) => {
    chai
      .request(app)
      .patch(`/api/categories/${catId}`)
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT UPDATE@@@@@"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // test for product start here ---------------------------------------------------------

  it("list product items in seller collection not found", (done) => {
    chai
      .request(app)
      .get("/api/products")
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.message).to.equal("no product found, please add new");
        expect(res).to.have.status(404);
        done();
      });
  });
  it("create product item sucessful in seller collection", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproduct")
      .field("stockLevel", "100 kg")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res.body.message).to.equal("Product item is successful created");
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(70000);
  it("create product item in seller collection with minimal images", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)

      .field("productName", "Test product Exist")
      .field("stockLevel", "100 kg")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res.body.error).to.equal(
          "Product item should have 4 up to 8 images"
        );
        expect(res).to.have.status(403);
        done();
      });
  });

  it("create product item in seller collection with invalid image format", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", notAllowedFormat)
      .field("productName", "Test product")
      .field("stockLevel", "100 kg")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res.body.error).to.equal(
          "Image upload error, Only .png, .jpg and .jpeg format allowed!"
        );
        expect(res).to.have.status(400);
        done();
      });
  });
  it("create product item in seller collection with big size image", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", bigSizePicture)
      .field("productName", "Test product")
      .field("stockLevel", "100 kg")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(5000);

  it("create product item in seller validation input fail", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Test product@@@")
      .field("productCategory", catId)
      .field("productPrice", "10rr0")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("create product item duplicate name in seller collection", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproduct")
      .field("stockLevel", "100 kg")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res.body.message).to.equals("This item already exists");
        expect(res).to.have.status(409);
        done();
      });
  });

  it("list product items in seller collection sucessfull", (done) => {
    chai
      .request(app)
      .get("/api/products")
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        productId = res.body.products[0].id;

        image_id = res.body.products[0].productPictures[0].imgId;

        expect(res).to.have.status(200);
        done();
      });
  });

  it("Seller crud operation get single product sucessful", (done) => {
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
    done();
  });

  it("check if product item exist in database", (done) => {
    chai
      .request(app)
      .get("/api/products/688b69db-ffff-407f-9622-f12d375ce02a")
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          "The product is not found , please try again"
        );
        expect(res).to.have.status(404);
        done();
      });
  });
  it("check if product item exist in database return internal server error", (done) => {
    chai
      .request(app)
      .get(
        "/api/products/688b69db-ffff-407f-9622-f12d375ce02a-ttrtr-rhhhdh-333444"
      )
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.error).to.equal("Internal server error");
        expect(res).to.have.status(500);
        done();
      });
  });
  it("Seller crud operation update product", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .field("productName", "Test product")
      .field("stockLevel", "100 kg")
      .end((err, res) => {
        expect(res.body.message).to.equal("product item is updated sucessful");
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);
  it("Seller crud operation update product validation fail", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .field("productName", "Test product###!!!")
      .end((err, res) => {
        expect(res.body.error).to.equal(
          "use characters and numbers for the product item name"
        );
        expect(res).to.have.status(400);
        done();
      });
  });

  it("Seller crud operation replace specific image", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/pictures/${image_id}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .end((err, res) => {
        expect(res.body.message).to.equal("image pictures is updated");
        expect(res).to.have.status(201);
        image_id = res.body.product.productPictures[0].imgId;
        done();
      });
  }).timeout(5000);

  it("Seller crud operation update image thumbnail", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/profile/${image_id}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.message).to.equal("the item thumbnail is updated");
        expect(res).to.have.status(201);

        image_id = res.body.product.productPictures[0].imgId;
        done();
      });
  }).timeout(5000);

  it("Seller crud operation want to product thumnail  but image not exist ", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/pictures/111111yyyy`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  }).timeout(5000);
  it("Seller crud operation want to replace specific image but not exist ", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/pictures/111111`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .end((err, res) => {
        expect(res.body.message).to.equal("the image id doesn't exist");
        expect(res).to.have.status(404);
        done();
      });
  });

  it("Seller crud operation delete specific image", (done) => {
    chai
      .request(app)
      .delete(`/api/products/${productId}/pictures/${image_id}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.message).to.equal("image pictures is removed");
        expect(res).to.have.status(203);
        done();
      });
  });
  it("Seller crud operation want to delete specific image but not exist ", (done) => {
    chai
      .request(app)
      .delete(`/api/products/${productId}/pictures/111111`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .end((err, res) => {
        expect(res.body.message).to.equal("the image id doesn't exist");
        expect(res).to.have.status(404);
        done();
      });
  });
  it("Seller crud operation want to delete product ", (done) => {
    chai
      .request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .end((err, res) => {
        expect(res).to.have.status(203);
        done();
      });
  });

  it("it shoult test product category delete ", (done) => {
    chai
      .request(app)
      .delete(`/api/categories/${catId}`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(res).to.have.status(203);
        done();
      });
  });
});
