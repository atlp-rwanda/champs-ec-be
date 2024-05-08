import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import app from "../app";

config();
chai.use(chaiHttp);
let headerToken: string = "";

// Two factor authentication tests
describe("buyer payment and creating orders", () => {
  it("Login as a buyer and want to craete order without a cart", (done) => {
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
  });

  it("Login as a buyer and want to craete order", (done) => {
    chai
      .request(app)
      .post("/api/users/login")
      .send({
        password: "Another@123",
        email: "userbuyer@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        headerToken = res.body.token;
        expect(res).to.have.status(200);
        done();
      });
  });
});
