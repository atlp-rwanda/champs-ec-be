import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import app from "../../../app";

config();
chai.use(chaiHttp);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let adminToken: string = "";
let buyerToken: string = "";

describe("Checking Passwords expiration via API", () => {
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
      .post("/api/users/check-passwords")
      .set("Authorization", buyerToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  }).timeout(5000);
  it("should return 401 if user is not loggedIn", (done) => {
    chai
      .request(app)
      .post("/api/users/check-passwords")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      });
  }).timeout(5000);
});
