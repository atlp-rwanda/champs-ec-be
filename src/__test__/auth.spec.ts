import chai from "chai";
import sinon, { SinonStub, SinonSandbox } from "sinon";
import chaiHttp from "chai-http";
import { describe, it, beforeEach, afterEach } from "mocha";
import app from "../app";
import passport from "../config/google.config";
import { userToken } from "../utils/token.generator";
import { handleGoogleCallback } from "../controllers/auth.controller";

chai.use(chaiHttp);
const { expect } = chai;

describe("Google Authentication", () => {
  let req: any,
    res: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: any,
    authenticateStub: SinonStub<any[], any>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userTokenStub: SinonStub<any[], any>;

  let sandbox: SinonSandbox;

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.stub();
    sandbox = sinon.createSandbox();
    authenticateStub = sandbox.stub(passport, "authenticate");

    userTokenStub = sandbox.stub().returns(Promise.resolve("example_token"));
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Handles Google Login Failure", (done) => {
    authenticateStub.callsFake((strategy, callback) => {
      callback(new Error("Authentication failed"), null);
    });

    chai
      .request(app)
      .get("/api/users/google")
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(authenticateStub.calledOnce).to.be.true;
        done();
      });
  });

  it("Handles User not found", (done) => {
    const user = null;
    const err = null;
    authenticateStub.callsArgWith(1, err, user);

    handleGoogleCallback(req, res);

    expect(res.status.calledWith(401));
    expect(res.json.calledWith({ error: "User not found" }));
    done();
  });

  it("generate token", (done) => {
    const generatedToken = userToken(
      "92c472c8-406a-4a89-898f-46965830316a",
      "amiparadis250@gmail.com"
    );
    expect(typeof generatedToken).to.equal("object");
    done();
  });

  it("should handle Google authentication failure", (done) => {
    authenticateStub.callsFake((strategy, callback) => {
      callback(new Error("Authentication failed"), null);
    });

    handleGoogleCallback(req, res);

    expect(res.status.calledWith(500));
    expect(
      res.json.calledWith({ error: "Failed to authenticate with Google" })
    );

    done();
  });

  it("should generate token for valid user", async () => {
    const user = { id: "ami paradis", email: "amiparadis250@gmail.com" };
    authenticateStub.callsArgWith(1, null, user);

    handleGoogleCallback(req, res);

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => process.nextTick(resolve));

    expect(res.status.calledWith(200));
    expect(res.json.calledWith({ token: "example_token" }));
  });
});
