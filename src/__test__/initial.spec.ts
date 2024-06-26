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
import Cart from "../models/Cart";
import Order from "../models/Order";
import Notification from "../models/Notifications";

const imageFilePath = "./src/__test__/image/JobIcon.png";

const notAllowedFormat = "./src/__test__/image/svgrepo.svg";
const bigSizePicture = "./src/__test__/image/svgrepo.svg";

let productId: string;
let image_id: string;
let orderid: string;
// eslint-disable-next-line import/no-mutable-exports
let headerTokenSeller: string;
let verifyTkn: string;
let catId: string;
let headerToken: string;
let buyerTKN: string;
let buyerTKN2: string;
let userId1: string;
let userId2: string;
let userId7: string;
chai.use(chaiHttp);
// eslint-disable-next-line func-names
before(async function () {
  this.timeout(50000);
  await dbConnect();
  await ProductCategory.truncate({ cascade: true });
  await Product.truncate({ cascade: true });
  await Role.truncate({ cascade: true });
  await Cart.truncate({ cascade: true });
  await Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff331",
    name: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff332",
    name: "buyer",
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
        isActive: true,
        password: await passwordEncrypt("Test@12345"),
        verified: true,
        email: "usertest@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff331"
      });

      // Create second user
      const user2 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        email: "anotheruser@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff332",
        verified: true
      });
      const user3 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Seller1234@"),
        email: "anotheruser1@gmail.com",
        verified: true,
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });
      const user4 = await User.create({
        firstName: "Another",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        verified: true,
        email: "anotheruser3@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });

      const user5 = await User.create({
        firstName: "Another2",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        email: "anotheruser5@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });

      const user6 = await User.create({
        firstName: "Another2",
        lastName: "User",
        password: await passwordEncrypt("Another@123"),
        email: "userbuyer@gmail.com",
        verified: true,
        roleId: "8736b050-1117-4614-a599-005dd76ff332"
      });

      const user7 = await User.create({
        firstName: "Another3",
        lastName: "User1",
        password: await passwordEncrypt("Another@123"),
        email: "userbuyer1@gmail.com",
        verified: true,
        roleId: "8736b050-1117-4614-a599-005dd76ff332"
      });
      const user8 = await User.create({
        id: "e01e6965-d534-48e4-8a41-e4d500796998",
        firstName: "Ernest",
        lastName: "Tchami",
        password: await passwordEncrypt("Test@12345"),
        verified: true,
        email: "Test@gmail.com",
        roleId: "8736b050-1117-4614-a599-005dd76ff331"
      });
      // const product = await Product.findAll({});

      const user9 = await User.create({
        firstName: "Another4",
        lastName: "User2",
        password: await passwordEncrypt("Another@123"),
        email: "userbuyer2@gmail.com",
        verified: false,
        roleId: "8736b050-1117-4614-a599-005dd76ff332"
      });
      // const product= await Product.findAll({});

      return [user1, user2, user3, user4, user5, user6, user7, user8, user9];
    } catch (error) {
      return error;
    }
  };

  // Call the function to create users

  const users: any = await createUsers();
  userId1 = users[1].dataValues.id;
  userId2 = users[5].dataValues.id;
  userId7 = users[7].dataValues.id;
  await Notification.create({
    id: "8736b050-1117-4614-a599-005dd76ff331",
    reciepent_id: userId7,
    message: "in this message is for the testing ",
    read: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await Notification.create({
    id: "8736b050-1117-4614-a599-005dd76ff332",
    reciepent_id: userId7,
    message: "in this message is for the testing ",
    read: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
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
  // ✅✅✅✅✅✅✅✅✅✅✅✅✅✅  Notification ✅✅✅✅✅✅✅✅✅✅
  let tokenNotification: string;
  it("Login for notification test", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "Test@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        tokenNotification = res.body.token;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("get the all notifications for seller", (done) => {
    chai
      .request(app)
      .get(`/api/notifications`)
      .set("Authorization", tokenNotification)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("get the all notifications for user who don't have it ", (done) => {
    chai
      .request(app)
      .get(`/api/notifications`)
      .set("Authorization", tokenNotification)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("Mark one notification as readen", (done) => {
    chai
      .request(app)
      .patch(`/api/notifications/8736b050-1117-4614-a599-005dd76ff331`)
      .set("Authorization", tokenNotification)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it("Mark one notification as readen for id not exist", (done) => {
    chai
      .request(app)
      .patch(`/api/notifications/8726b050-1117-4614-a599-005dd76ff331`)
      .set("Authorization", tokenNotification)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("Mark all notification as readen", (done) => {
    chai
      .request(app)
      .patch(`/api/notifications`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  // ✅✅✅✅✅✅✅✅✅✅✅✅✅✅ End of  Notification ✅✅✅✅✅✅✅
  it("Login end point test buyer 2", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Another@123",
        email: "userbuyer1@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        buyerTKN2 = res.body.token;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("Login end point test for unverified user ", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Another@123",
        email: "userbuyer2@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });

  it("Login as a buyer and get a token", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Another@123",
        email: "userbuyer@gmail.com"
      })
      .end((err, res) => {
        buyerTKN = res.body.token;
        expect(err).to.be.null;
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
      });
  });

  it("should show 500 error in logining in the user", (done) => {
    const userStub = sinon.stub(User, "findOne").throws(new Error());
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
  }).timeout(5000);
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

  it("should get all role when you are not admin", (done) => {
    chai
      .request(app)
      .get(`/api/roles`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);

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

  it("getting all users with invalid user Id", (done) => {
    chai
      .request(app)
      .get(`/api/users/id`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
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
});
describe("products and product categgories", () => {
  it("it should test to list product categories but it is not created", (done) => {
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
  it("it should test product category creation", (done) => {
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
  it("try to get categories for user which is not admin or seller", (done) => {
    chai
      .request(app)
      .get("/api/categories")
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
  it("it should test to list product categories with success", (done) => {
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
  it("it should test getting single product category", (done) => {
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
  it("it should test getting unexisting product category  ", (done) => {
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
  it("it should test getting product category with invalid uuid ", (done) => {
    chai
      .request(app)
      .get(`/api/categories/d62aa7d1-23b3-437b-8407-adaf24b3eb4chhhhhhgg`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
  it("it should test product category with existing name ", (done) => {
    chai
      .request(app)
      .post("/api/categories")
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT"
      })
      .end((err, res) => {
        expect(res.body.message).to.equal("This Category already exists");
        expect(res).to.have.status(409);
        done();
      });
  });
  it("should return 400 with product(seller(category))", (done) => {
    chai
      .request(app)
      .get("/api/search")
      .query({ category: "TEST CAT" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("it should test product category  with validation fail", (done) => {
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
  it("it should test product category update ", (done) => {
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
  it("it should test product category  with validation fail on Update", (done) => {
    chai
      .request(app)
      .patch(`/api/categories/${catId}`)
      .set("Authorization", headerToken)
      .send({
        categoryName: "TEST CAT@@@"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("it should test product category update validation fail ", (done) => {
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
  /*
  it("create product item successful in seller collection", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", buyerTKN)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproduct")
      .field("stockLevel", "100")
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
        expect(res.body.error).to.equal("Unauthorized, for this user type");
        expect(res).to.have.status(403);
        done();
      });
  }).timeout(70000);
*/
  it("create product item successful in seller collection", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproduct")
      .field("stockLevel", "100")
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
  // Inside your test
  it("should return 200 with product(seller(maxPrice))", (done) => {
    chai
      .request(app)
      .get("/api/search")
      .query({ maxPrice: 100 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return 200 with product(seller(minPrice))", (done) => {
    chai
      .request(app)
      .get("/api/search")
      .query({ minPrice: 10 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("create product item in seller collection with minimal images", (done) => {
    chai
      .request(app)
      .post("/api/products")
      .set("Authorization", headerTokenSeller)

      .field("productName", "Test product Exist")
      .field("stockLevel", "100")
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
      .field("stockLevel", "100")
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
      .field("stockLevel", "100")
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
  it("should return 200 with product(seller)", (done) => {
    chai
      .request(app)
      .get("/api/search")
      .set("Authorization", headerTokenSeller)
      .query({ name: "product" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should return 200 with product(others)", (done) => {
    chai
      .request(app)
      .get("/api/search")
      .query({ name: "product" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

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
      .field("stockLevel", "100")
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
  }).timeout(70000);

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

  // THE TEST ✅✅✅✅✅✅✅✅✅✅✅✅✅✅ TEST OF CARTS✅✅✅✅✅✅✅✅✅✅✅

  it("user invalid uuid 993", (done) => {
    chai
      .request(app)
      .post(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send("knknkjn")
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should update a product in the seller collection", (done) => {
    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproducts")
      .field("stockLevel", "100")
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
        // expect(res.body.message).to.equal("Product item is successful created");
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("user get carts if you don't have it", (done) => {
    chai
      .request(app)
      .get(`/api/carts`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  // client oredrs test start here ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  it("user Create the new Carts with more quantity than exist on line 934", (done) => {
    const orders = {
      buyerId: userId2,
      productId,
      totalAmount: 10000,
      deliveryDate: new Date(),
      quantity: 3,
      isPaid: false,
      paymentDate: new Date()
    };
    Order.create(orders);

    chai
      .request(app)
      .post(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send([
        {
          productId: `${productId}`,
          Quantity: 1
        },
        {
          productId: `${productId}`,
          Quantity: 2
        },
        {
          productId: `${productId}`,
          Quantity: 209
        }
      ])
      .end((err, res) => {
        expect(res).to.have.status(413);
        done();
      });
  }).timeout(70000);
  // order test start here ------------------------------------
  it("stub fake create order test ", (done) => {
    const roleStub = sinon
      .stub(Order, "create")
      .throws(new Error("Order is successful creates"));
    const orders = {
      buyerId: userId2,
      productId,
      totalAmount: 10000,
      deliveryDate: new Date(),
      quantity: 3,
      isPaid: false,
      paymentDate: new Date()
    };
    chai
      .request(app)
      .get(`/api/payments/success?user=${userId2}`)
      .set("Authorization", buyerTKN)
      .send(orders)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });

  it("get order values as seller", (done) => {
    chai
      .request(app)
      .get(`/api/orders`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        orderid = res.body.orders[0].id;
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("get single order values ", (done) => {
    chai
      .request(app)
      .get(`/api/orders/${orderid}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("update single order values ", (done) => {
    chai
      .request(app)
      .patch(`/api/orders/${orderid}`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Delivered" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("update single order values with validation fail", (done) => {
    chai
      .request(app)
      .patch(`/api/orders/${orderid}`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Deliveredyyy" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(70000);
  it("update single order values with invalid Id ", (done) => {
    chai
      .request(app)
      .patch(`/api/orders/${orderid}12334`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Delivered" })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  }).timeout(70000);
  it("update unexisting single order values with static value", (done) => {
    chai
      .request(app)
      .patch(`/api/orders/11a57e40-9a28-4cc0-9431-30f3238ee0fb`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Delivered" })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  }).timeout(70000);
  it("as buyer get single order values ", (done) => {
    chai
      .request(app)
      .get(`/api/orders/${orderid}`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);
  it("as  a buyer get all orders ", (done) => {
    chai
      .request(app)
      .get(`/api/orders`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("stub throw internal error for getting all orders ", (done) => {
    const roleStub = sinon
      .stub(Order, "findAll")
      .throws(new Error("Order is successful creates"));
    chai
      .request(app)
      .get(`/api/orders`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
  it("stub throw internal error for getting single orders ", (done) => {
    const roleStub = sinon
      .stub(Order, "findOne")
      .throws(new Error("Order is successful creates"));
    chai
      .request(app)
      .get(`/api/orders/${userId2}`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });

  // order status
  it("update single order status ", (done) => {
    chai
      .request(app)
      .post(`/api/orders/${orderid}/status`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Delivered" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("update order not found", (done) => {
    chai
      .request(app)
      .post(`/api/orders/301cb6d1-7299-4a45-8717-7d2c9faf788e/status`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Delivered" })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  }).timeout(70000);

  it("update order invalid status", (done) => {
    chai
      .request(app)
      .post(`/api/orders/${orderid}/status`)
      .set("Authorization", headerTokenSeller)
      .send({ status: "Deliveredx" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(70000);

  it("Get order status ", (done) => {
    chai
      .request(app)
      .get(`/api/orders/${orderid}/status`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);

  it("should not Get order status ", (done) => {
    chai
      .request(app)
      .get(`/api/orders/301cb6d1-7299-4a45-8717-7d2c9faf788e/status`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  }).timeout(70000);

  // test end here---------------
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // the test for product reviews

  it("it should bring invalid product id", () => {
    chai
      .request(app)
      .post("/api/products/id/reviews")
      .set("Authorization", buyerTKN)
      .send({
        rating: 5,
        feedback: "hello world!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring invalid rating", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        feedback: "hello world!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring invalid rating", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 4
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring rating range 0-5", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 7,
        feedback: "hello world!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring rating is range 0 - 5", () => {
    chai
      .request(app)
      .post("/api/products/id/reviews")
      .set("Authorization", buyerTKN)
      .send({
        rating: -4,
        feedback: "hello world"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring invalid product format", () => {
    chai
      .request(app)
      .post(`/api/products/f4c6cb8c-e6b9-47d0-tb04-fa394042c5fa/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 5,
        feedback: "hello world!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });

  it("it should bring invalid product format", () => {
    chai
      .request(app)
      .post(`/api/products/2394a73c-80d1-4d82-a677-c15343a8a51e/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 5,
        feedback: "hello world!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
      });
  });

  it("it should create a new review", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 4,
        feedback: "Wonderful product"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  it("it shouldnot create a new review when you havent purchased the product", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN2)
      .send({
        rating: 4,
        feedback: "Wonderful product"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
      });
  });

  it("it should update a new review", () => {
    chai
      .request(app)
      .post(`/api/products/${productId}/reviews`)
      .set("Authorization", buyerTKN)
      .send({
        rating: 5,
        feedback: "Wonderful product!!"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });

  // ******* review test end here ***************

  it("user Create the new Carts with post on line 934", (done) => {
    chai
      .request(app)
      .post(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send([
        {
          productId: `${productId}`,
          Quantity: 1
        },
        {
          productId: `${productId}`,
          Quantity: 2
        },
        {
          productId: `${productId}`,
          Quantity: 9
        }
      ])
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(70000);

  it("user Create cart with wrong uui", (done) => {
    chai
      .request(app)
      .post(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send([
        {
          productId: `ed416bb0-2a02-4777-88b6-8ff6d3`,
          Quantity: 1
        }
      ])
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  }).timeout(70000);
  it("user update cat with put 1006", (done) => {
    chai
      .request(app)
      .put(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send([
        {
          productId: `${productId}`,
          Quantity: 10
        }
      ])
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(5000);
  it("user update cat with put with error 1006", (done) => {
    chai
      .request(app)
      .put(`/api/carts`)
      .set("Authorization", buyerTKN)
      .send([
        {
          productId: `${productId}`,
          Quantity: 200
        }
      ])
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("user get carts", (done) => {
    chai
      .request(app)
      .get(`/api/carts`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("stub throw internal error for user cart ", (done) => {
    const roleStub = sinon
      .stub(Cart, "findAll")
      .throws(new Error("User is successful creates"));
    chai
      .request(app)
      .get(`/api/carts`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
  it("user send payments request to stripe when no cart created", (done) => {
    chai
      .request(app)
      .post(`/api/payments`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  }).timeout(150000);
  it("user send payments request to stripe", (done) => {
    chai
      .request(app)
      .post(`/api/payments`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(150000);

  // END  THE TEST ✅✅✅✅✅✅✅✅✅✅✅✅✅✅ TEST OF CARTS✅✅✅✅✅✅✅✅✅✅✅

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
  it("check if product item exist in database return invalid product Id", (done) => {
    chai
      .request(app)
      .get(
        "/api/products/688b69db-ffff-407f-9622-f12d375ce02a-ttrtr-rhhhdh-333444"
      )
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res.body.error).to.equal(
          "Invalid product ID  please check and try again"
        );
        expect(res).to.have.status(403);
        done();
      });
  });

  it("Seller crud operation update product status", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/status`)
      .set("Authorization", headerTokenSeller)
      .send({ isAvailable: true })
      .end((err, res) => {
        expect(res.body.message).to.equal("Product marked as available");
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);
  it("list  available product items ", (done) => {
    chai
      .request(app)
      .get("/api/products")
      .end((err, res) => {
        productId = res.body.products[0].id;

        image_id = res.body.products[0].productPictures[0].imgId;

        expect(res).to.have.status(200);
        done();
      });
  });
  //* *********feature a product  */
  it("list product items in seller collection sucessfull", (done) => {
    chai
      .request(app)
      .get("/api/products")
      .end((err, res) => {
        productId = res.body.products[0].id;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should fail to feature a product", (done) => {
    chai;
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("fail to  feature a product due to invalid feature end date format", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "prince" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should feature a product successfully", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "10/10/2024" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Product featured successfully");
        done();
      });
  });
  it("should  fail to feature a product due to past feature end date ", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "01/01/2024" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should  fail to feature a product due to date greater than expiration date ", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "12/12/2050" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should unfeature a product successfully", (done) => {
    chai
      .request(app)
      .patch(`/api/products/${productId}/feature`)
      .set("Authorization", headerToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should  fail to feature a product due to unexisting productId ", (done) => {
    const nonExistentProductId = "98996493-303d-447b-af80-66cf9984087a";
    chai
      .request(app)
      .patch(`/api/products/${nonExistentProductId}/feature`)
      .set("Authorization", headerToken)
      .send({ featureEndDate: "10/10/2024" })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  //* **********end of feature a product  */
  it("stub throw internal error for getting all products ", (done) => {
    const roleStub = sinon
      .stub(Product, "findAll")
      .throws(new Error("User is successful creates"));
    chai
      .request(app)
      .get(`/api/products`)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
  it("Seller crud operation get single available product ", (done) => {
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(70000);
  it("stub throw internal error for getting single product ", (done) => {
    const roleStub = sinon
      .stub(Product, "findOne")
      .throws(new Error("User is successful creates"));
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .end((err, res) => {
        roleStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });

  it("seller should operation product with unexisting category", (done) => {
    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproductsss")
      .field("stockLevel", "100")
      .field("productCategory", "5f2b7ae0-7466-46dc-8871-83c86955c727")
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "0")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  }).timeout(70000);

  it("seller should operation product with discount greater than existing price", (done) => {
    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "Testproductss")
      .field("stockLevel", "100")
      .field("productCategory", catId)
      .field("productPrice", "100")
      .field("productCurrency", "rwf")
      .field("productDiscount", "100000")
      .field(
        "productDescription",
        "If you’re developing in an environment with support for promises"
      )
      .field("expireDate", "2025-12-12")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  }).timeout(70000);
  // it("Seller crud operation update product with discount grater than price", (done) => {
  //   chai
  //     .request(app)
  //     .patch(`/api/products/${productId}`)
  //     .set("Authorization", headerTokenSeller)
  //     .attach("productImage", imageFilePath)
  //     .field("productDiscount", "1000000")
  //     .end((err, res) => {
  //       expect(res.body.error).to.equal(
  //         "product discount can't be greater than price"
  //       );
  //       expect(res).to.have.status(403);
  //       done();
  //     });
  // });

  it("seller get single product internal server error", (done) => {
    const userStub = sinon
      .stub(Product, "findOne")
      .throws(new Error("internal server error"));
    chai
      .request(app)
      .get(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        userStub.restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  }).timeout(5000);

  it("seller crud operation update product validation fail", (done) => {
    chai
      .request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", headerTokenSeller)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .attach("productImage", imageFilePath)
      .field("productName", "@@@@")
      .field("stockLevel", "100")
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
  }).timeout(70000);

  // it("Seller crud operation update product validation fail", (done) => {
  //   chai
  //     .request(app)
  //     .put(`/api/products/${productId}`)
  //     .set("Authorization", headerTokenSeller)
  //     .field("productName", "Test product###!!!")
  //     .end((err, res) => {
  //       // expect(res.body.error).to.equal(
  //       // "use characters and numbers for the product item name"
  //       // );
  //       expect(res).to.have.status(400);
  //       done();

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
  // Start Wish list Tests ===========================
  it("should get empty product wishes", (done) => {
    chai
      .request(app)
      .get(`/api/wishes/`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should create add product to wishes", (done) => {
    chai
      .request(app)
      .post(`/api/wishes/`)
      .send({ productId })
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should not create a wish when the product id wrong", (done) => {
    chai
      .request(app)
      .post(`/api/wishes/`)
      .send({ productId: "string" })
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should get users wishes/ wishlist", (done) => {
    chai
      .request(app)
      .get(`/api/wishes/`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should get seller products wishlist", (done) => {
    chai
      .request(app)
      .get(`/api/wishes/`)
      .set("Authorization", headerTokenSeller)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should fail invalid product to wishes", (done) => {
    chai
      .request(app)
      .post(`/api/wishes/`)
      .send({ productId: "979da368-6974-46fc-98d4-dbaf3ebb4dda" })
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it("should remove product to wishes", (done) => {
    chai
      .request(app)
      .post(`/api/wishes/`)
      .send({ productId })
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("add product to wishes again product to wishes", (done) => {
    chai
      .request(app)
      .post(`/api/wishes/`)
      .send({ productId })
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should flush product wishes", (done) => {
    chai
      .request(app)
      .delete(`/api/wishes/`)
      .set("Authorization", buyerTKN)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // end test wishlists  ========================================================

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

describe("Test user should be able to update their password", () => {
  it("should return 400 if request data is missing", (done) => {
    chai
      .request(app)
      .patch("/api/users/passwordUpdate")
      .set("Authorization", headerToken)
      .send({
        oldPassword: "",
        newPassword: "NewPass1234@",
        confirmPassword: "NewPass1234@"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should return 400 if old password is false", (done) => {
    chai
      .request(app)
      .patch("/api/users/passwordUpdate")
      .set("Authorization", headerToken)
      .send({
        oldPassword: "Test@12348",
        newPassword: "NewPass1234@",
        confirmPassword: "NewPass1234@"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should return 400 if newPassword doesn't match confirmPassowrd", (done) => {
    const rightData = {
      oldPassword: "Test@12345",
      newPassword: "NewPass1234@",
      confirmPassword: "NewPass1234"
    };
    chai
      .request(app)
      .patch(`/api/users/passwordUpdate`)
      .set("Authorization", headerToken)
      .send(rightData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return password sucessfully updated", (done) => {
    const rightData = {
      oldPassword: "Another@123",
      newPassword: "String23@oi",
      confirmPassword: "String23@oi"
    };
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        email: "anotheruser@gmail.com",
        password: "Another@123"
      })
      .end((err, res) => {
        chai
          .request(app)
          .patch(`/api/users/passwordUpdate`)
          .set("Authorization", res.body.token)
          .send(rightData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
          });
      });
  }).timeout(50000);

  // it("should respond with user logged out", (done) => {
  //   chai
  //     .request(app)
  //     .post("/api/users/logout")
  //     .set("Authorization", headerToken)
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       done();
  //     });
  // });

  it("should respond with error message if token is not provided", (done) => {
    chai
      .request(app)
      .post("/api/users/logout")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
});
