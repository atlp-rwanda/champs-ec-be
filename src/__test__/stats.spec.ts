/* eslint-disable no-shadow */
import { describe, it, before } from "mocha";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../app";
import User from "../models/user";
import Role from "../models/Role";
import { passwordEncrypt } from "../utils/encrypt";
import Product from "../models/Product";
import ProductCategory from "../models/product_category";
import Cart from "../models/Cart";
import { DataInfo } from "../controllers/otpauth.controllers";
import { tokenVerify } from "../utils/token.generator";

chai.use(chaiHttp);

describe("Statics Test", function () {
  this.timeout(300000);
  let otpToken = "";
  let validJwt = "";
  before(async function () {
    try {
      await ProductCategory.truncate({ cascade: true });
      await Product.truncate({ cascade: true });
      await Role.truncate({ cascade: true });
      await Cart.truncate({ cascade: true });

      await Role.bulkCreate([
        { id: "8736b050-1117-4614-a599-005dd76ff331", name: "admin" },
        { id: "8736b050-1117-4614-a599-005dd76ff332", name: "buyer" },
        { id: "8736b050-1117-4614-a599-005dd76ff333", name: "seller" }
      ]);

      await User.create({
        firstName: "ISHIMWE",
        lastName: "Ami Paradis",
        password: await passwordEncrypt("Seller1234@"),
        email: "ishimweamiparadis26@gmail.com",
        verified: true,
        roleId: "8736b050-1117-4614-a599-005dd76ff333"
      });
    } catch (error) {
      console.error("Error in before hook:", error);
    }
  });

  describe("User login", () => {
    it("should login a user and capture the OTP token", (done) => {
      chai
        .request(app)
        .post("/api/users/login")
        .send({
          email: "ishimweamiparadis26@gmail.com",
          password: "Seller1234@"
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          otpToken = res.body.otpToken;
          console.log("Unverified OTP token:", otpToken);
          done();
        });
    });
  });

  describe("OTP validation", () => {
    it("should validate OTP input and generate a valid JWT", async () => {
      try {
        const data: any = await new Promise((resolve, reject) => {
          tokenVerify(otpToken, (err: any, data: DataInfo) => {
            if (err) reject(err);
            else resolve(data);
          });
        });

        const otpCode = data.body.otp;

        const res = await chai
          .request(app)
          .post(`/api/users/otp/${otpToken}`)
          .send({ otp: otpCode });

        expect(res).to.have.status(200);
        validJwt = res.body.token;
        // console.log("Valid JWT:", validJwt);
      } catch (error) {
        // console.error("Error in OTP validation:", error);
      }
    });
  });

  describe("Testing statics functionality", () => {
    it("should return a statics object with valid JWT", (done) => {
      chai
        .request(app)
        .get("/api/stats")
        .set("Authorization", validJwt)
        .query({ start: "2023-02-06", end: "2027-07-14" })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("status").that.equals("success");
          expect(res.body.data).to.be.an("object");
          expect(res.body.data)
            .to.have.property("productsStats")
            .that.is.a("number");
          expect(res.body.data)
            .to.have.property("expiredProducts")
            .that.is.a("number");
          expect(res.body.data)
            .to.have.property("wishesStats")
            .that.is.a("number");
          expect(res.body.data)
            .to.have.property("availableProducts")
            .that.is.a("number");
          expect(res.body.data)
            .to.have.property("stockLevelStats")
            .that.is.a("number");
          done();
        });
    });

    it("should return 401 without JWT", (done) => {
      chai
        .request(app)
        .get("/api/stats")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });

    it("should return 401 for unauthorized JWT", (done) => {
      chai
        .request(app)
        .get("/api/stats")
        .set("Authorization", "Bearer invalidToken")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
