import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import app from "../../../app";

config();
chai.use(chaiHttp);
let adminToken: string = "";
let buyerToken: string = "";

describe("Checking Products expiration via API", () => {
  before((done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Test@12345",
        email: "usertest@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        adminToken = res.body.token;
        done();
      });
  });
  it("should return 200 if user is Admin and password checking algoritms was hit", (done) => {
    chai
      .request(app)
      .post("/api/products/check-expiration")
      .set("Authorization", adminToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });
  it("should return 401 if user is logged in but not an Admin", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Another@123",
        email: "anotheruser@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        buyerToken = res.body.token;
      });

    chai
      .request(app)
      .post("/api/products/check-expiration")
      .set("Authorization", buyerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
  it("should return 401 if user is not loggedIn", (done) => {
    chai
      .request(app)
      .post("/api/products/check-expiration")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  });
});
