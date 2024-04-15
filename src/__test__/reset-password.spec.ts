import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import app from "../app";

config();
chai.use(chaiHttp);
let userToken: string = "";

describe("Password resetting via email", () => {
  before((done) => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Kanu",
        lastName: "castro",
        password: "Andela@123",
        email: "kanumacastro23@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });
  it("should return 200 if user exists", (done) => {
    chai
      .request(app)
      .post("/api/users/reset-password")
      .send({ email: "kanumacastro23@gmail.com" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.msg).to.be.equals(
          "Password reset Instructions sent successfully"
        );
        const { token } = res.body;
        userToken = token;
        done();
      });
  });
  it("should return 200 if password are updated successfully", (done) => {
    chai
      .request(app)
      .patch(`/api/users/reset-password/${userToken}`)
      .send({
        newPassword: "Andela@123",
        confirmPassword: "Andela@123"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.msg).to.be.equals("Password updated succesfully");
        done();
      });
  });
  it("should return 400 if passwords dont match", (done) => {
    chai
      .request(app)
      .patch(`/api/users/reset-password/${userToken}`)
      .send({
        newPassword: "Andela@123",
        confirmPassword: "Andelan@1234"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.msg).to.be.equals("Passwords don't match");
        done();
      });
  });
  it("should return 400 if user provides weak password", (done) => {
    chai
      .request(app)
      .patch(`/api/users/reset-password/${userToken}`)
      .send({
        newPassword: process.env.TEST_PASSWORD_FAIL,
        confirmPassword: process.env.TEST_PASSWORD_FAIL
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body.msg).to.be.equals(
          "Password must have atleast 8 to 15 characters"
        );
        done();
      });
  });
  it("should return 400 if user provides invalid token", (done) => {
    chai
      .request(app)
      .patch(`/api/users/reset-password/${process.env.EXPIRED_JWT_TOKEN}`)
      .send({
        newPassword: process.env.TEST_PASSWORD,
        confirmPassword: process.env.TEST_PASSWORD
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should return 404 if user doesn't exist", (done) => {
    chai
      .request(app)
      .post("/api/users/reset-password")
      .send({ email: "kanumacas@gmail.com" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.msg).to.be.equals("User not found");
        done();
      });
  });
});
