import { describe, it } from "mocha";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { config } from "dotenv";
import sinon from "sinon";
import app from "../app";
import { passwordCompare, passwordEncrypt } from "../utils/encrypt";
import { DataInfo } from "../controllers/otpauth.controllers";
import { sendMail, transporter } from "../utils/mailer";
import { tokenVerify } from "../utils/token.generator";

config();
chai.use(chaiHttp);
let otpToken: string = "";
// Two factor authentication tests
describe("Two factor authentication with Email", () => {
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
        otpToken = res.body.otpToken;
        expect(res.body.message).to.equal(
          "Verify with 2FA before access is granted"
        );
        done();
      });
  });
  it("should input OTP", (done) => {
    chai
      .request(app)
      .post(`/api/users/otp/${otpToken}`)
      .send({
        otp: ""
      })
      .end((err, res) => {
        console.log("======== res body", res);
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("Invalid OTP");
        done();
      });
  });
  it("should Wrong OTP entered", (done) => {
    chai
      .request(app)
      .post(`/api/users/otp/${otpToken}`)
      .send({
        otp: "great"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal("Wrong OTP entered");
        done();
      });
  });
  it("should Invalid token", (done) => {
    chai
      .request(app)
      .post(`/api/users/otp/hello`)
      .send({
        otp: "123456"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal("Invalid token");
        done();
      });
  });
  it("should send a new token in case of expired tokens", async () => {
    const otpTokenExpired = process.env.EXPIRED_JWT_TOKEN as string;
    await chai
      .request(app)
      .post(`/api/users/otp/${otpTokenExpired}`)
      .send({
        otp: "123467"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal("Token expired, new Token generated");
      });
  });
  it("should Validate otp input", async () => {
    let otpCode: string = "";
    const resultOtpToken = async (err: Error, data: DataInfo) => {
      const decoded = data;
      otpCode = decoded.body.otp;
      return decoded;
    };
    await tokenVerify(otpToken, resultOtpToken);
    chai
      .request(app)
      .post(`/api/users/otp/${otpToken}`)
      .send({ otp: `${otpCode}` })
      .end(async (err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Login seller successful");
        expect(res.body.token).to.be.undefined;
      });
  });
  it("should bring error in Mail sending email", async () => {
    const sendMailFunctionError = sinon
      .stub(transporter, "sendMail")
      .rejects(new Error("Error sending mail:"));
    try {
      await sendMail({});
    } catch (error: any) {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal("Error sending email:");
      sinon.assert.calledOnce(sendMailFunctionError);
    }
    sendMailFunctionError.restore();
  });
});

describe("Bcrypt compare", () => {
  it("compare bcrypt Fail", async () => {
    const result = await passwordCompare("hello", "hello");
    expect(result).to.be.false;
  });
  it("compare bcrypt Pass", async () => {
    const hashedPassword = await passwordEncrypt("hello");
    const result = await passwordCompare(hashedPassword, "hello");
    expect(result).to.be.true;
  });
});
