import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import { dbConnect } from "../config/db.config";
import User from "../models/user";
import { passwordEncrypt } from "../utils/encrypt";

chai.use(chaiHttp);
before(async function () {
  this.timeout(50000);
  await dbConnect();
  await User.truncate();
  await User.create({
    firstName: "Ernest",
    lastName: "Tchami",
    password: await passwordEncrypt("Test@12345"),
    email: "usertest@gmail.com"
  });
});
describe("test a user signup endpoint", () => {
  it("it should create a user successful", () => {
    const r = (Math.random() + 1).toString(36).substring(5);
    const userEmail = `u${r}@gmail.com`;
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
      });
  });
  it("should return user exist", () => {
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
      });
  });
  it("it should test a user validation fail", () => {
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
      });
  });

  it("user fail to verify user with invalid token", () => {
    chai
      .request(app)
      .get(
        "/api/users/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5OTRlZmRlLTEwYzAtNDhkNC1hNjEyLThiZDE0M2UxNDE0YiIsImVtYWlsIjoic2FiYXRvQGlnaWhlLnJ3IiwiaWF0IjoxNzEyMjA2NzY2LCJleHAiOjE3MTQ3OTg3NjZ9.-NHAR2uzikIfmPWuN0nx_smlx3NOFezcN2A32sxtJvU/verify-email"
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
      });
  });
});
let token = "";
describe("user Signin controller and passport", () => {
  it("Login end point test", () => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        token = res.body.token;
        expect(res).to.have.status(200);
      });
  });
  it("Login end Fail to login", () => {
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
      });
  });
  it("Login end Fail to login for password", () => {
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
      });
  });
  it("use invalid email", () => {
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
      });
  });
});
describe("test a home route", () => {
  it("should respond with the welcome message", () => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
      });
  });
  it("should respond with the welcome message", () => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        chai
          .request(app)
          .get("/")
          .set("Authorization", res.body.token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
          });
        expect(res).to.have.status(200);
      });
  });
});
