/* eslint-disable func-names */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";
import app from "../app";
import { dbConnect } from "../config/db.config";
import User from "../models/user";
import Role from "../models/Role";
import { passwordEncrypt } from "../utils/encrypt";

const imageFilePath = "./src/__test__/image/test.jpg";
console.log("final image-------------------------", imageFilePath);
let headerToken: any;
let userId1: string;
chai.use(chaiHttp);
before(async function () {
  this.timeout(50000);
  await dbConnect();
  await Role.truncate({ cascade: true });
  Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff331",
    name: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  Role.create({
    id: "8736b050-1117-4614-a599-005dd76ff332",
    name: "user",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  Role.create({
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
        password: await passwordEncrypt("AnotherPassword"),
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
      return [user1, user2, user3];
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
  });

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
  // it("should show 500 error in creating the user", (done) => {
  //   const userStub = sinon
  //     .stub(User, "create")
  //     .throws(new Error("internal server error"));
  //   chai
  //     .request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       firstName: "Ernest",
  //       lastName: "Tchami",
  //       password: "Test@12345",
  //       email: "emailfortest33@gmail.com"
  //     })
  //     .end((err, res) => {
  //       userStub.restore();
  //       expect(res.statusCode).to.equal(500);
  //       done();
  //     });
  // }).timeout(5000);

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
  // it("update user profile with an image ", () => {
  //   const res = chai
  //     .request(app)
  //     .put("/api/users/profiles")
  //     .set("Authorization", headerToken)
  //     .attach("profileImage", imageFilePath)
  //     .field("firstName", "Ernest")
  //     .field("lastName", "Tchami");
  //   expect(res).to.have.status(201);
  //   console.log(res);
  // });
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
    console.log(
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
      headerToken
    );
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
  });
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
        console.log(createdRoleId);
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
        console.log(createdRoleId);
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
        console.log(createdRoleId);
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
        console.log(createdRoleId);
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
  // assign unexisting role to user
  // it("should assign unexisting role to a user", (done) => {
  //   chai
  //     .request(app)
  //     .patch(`/api/users/${createdUserId}/roles`)
  //     .set("Authorization", headerToken)
  //     .send({ roleId: "88" })
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(500);
  //       done();
  //     });
  // });
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
      .put(`/api/roles/8bb8bbc1-364b-46e6a5-fb2e4614c659`)
      .set("Authorization", headerToken)
      .send({ name: "Updated" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);

        done();
        console.log(res.body.token);
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
});
