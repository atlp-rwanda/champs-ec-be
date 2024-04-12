/* eslint-disable @typescript-eslint/no-unused-vars */
import chai from "chai";
import sinon, { SinonStub, SinonSandbox } from "sinon";
import chaiHttp from "chai-http";
import { describe, it, beforeEach, afterEach } from "mocha";
import app from "../app";
import { passport, handleGoogleCallback } from "../controllers/auth.controller";
import { userToken } from "../utils/token.generator";

chai.use(chaiHttp);
const { expect } = chai;

describe("Google Authentication", () => {
  let req: any,
    res: any,
    next: any,
    authenticateStub: SinonStub<any[], any>,
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

    userTokenStub = sandbox.stub();
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
      .get("/api/users/login/google")
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

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: "User not found" })).to.be.true;
    done();
  });

  it("Handles Error during Google Authentication", (done) => {
    const err = new Error("Authentication failed");
    authenticateStub.callsArgWith(1, err, null);

    handleGoogleCallback(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: "Failed to authenticate with Google" }))
      .to.be.true;
    done();
  });

  // it('Handles Successful Google Authentication', async () => {
  //   const google = sinon
  //     .stub(Database.User.prototype, 'save')
  //     .throws(new Error('Authentication error'));

  //   const user = {
  //     id: '',
  //     googleId: 'google_id',
  //     photoUrl: 'sample_photo_url',
  //     email: 'sample@example.com',
  //     verified: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   chai

  //     .request(app)
  //     .get('/api/users/google-auth')
  //     .send(user)
  //     .end((err, res) => {
  //       google.restore();

  //       expect(res.statusCode).to.equal(500);
  //       expect(res.body).to.have.property('message');
  //       done();
  //     });
  // });
});
