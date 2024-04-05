import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import { dbConnect } from "../config/db.config";
import User from "../models/user";
import { passwordEncrypt } from "../utils/encrypt";

const imageFilePath = "./src/__test__/image/test.jpg";

let headerToken: any;

chai.use(chaiHttp);
before(async function () {
  this.timeout(3600000);
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
        console.log("user created ------------------------------------");
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
        console.log("Header number 2", headerToken);
        expect(res).to.have.status(200);
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
});
describe("test a home route", () => {
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
});

describe("user profile", () => {
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

  it("update user profile with unauthirized field", () => {
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
      .then((res) => {
        expect(res).to.have.status(201);
      })
      .catch((err) => {
        throw err;
      });
  });
});
