import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import { error } from "console";
import app from "../app";

config();
chai.use(chaiHttp);
let adminToken: string = "";
let userId: string;
// Two factor authentication tests
describe("Admin disable and activating user account", () => {
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
        expect(res.body)
          .to.have.property("message")
          .equal("Incorrect username");
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
  it("Email sent successfully", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        adminToken = res.body.token;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should get all users unauthorised", (done) => {
    chai
      .request(app)
      .get(`/api/users`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should get all users", (done) => {
    chai
      .request(app)
      .get(`/api/users`)
      .set("Authorization", adminToken)
      .end((err, res) => {
        userId = res.body.users[4].id;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should get a single user", (done) => {
    chai
      .request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", adminToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should deactivate user account with validation fail", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId}/status`)
      .set("Authorization", adminToken)
      .send({ status: "deactivate" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should deactivate user account with invalid uuid", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId}1111/status`)
      .set("Authorization", adminToken)
      .send({ status: "deactivate" })
      .send({
        message:
          "admin is able to trigger an action to block usage of a particular account and an email sent to the user with reasons for the block"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        done();
      });
  });
  it("should deactivate user account with email response", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId}/status`)
      .set("Authorization", adminToken)
      .send({ status: "deactivate" })
      .send({
        message:
          "admin is able to trigger an action to block usage of a particular account and an email sent to the user with reasons for the block"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it("admin reactivate user account ", (done) => {
    chai
      .request(app)
      .patch(`/api/users/${userId}/status`)
      .set("Authorization", adminToken)
      .send({ status: "activate" })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(5000);
});
