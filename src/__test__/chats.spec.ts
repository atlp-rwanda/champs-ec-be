import { describe, it } from "mocha";
import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import app from "../app";

chai.use(chaiHttp);

describe("Chat Application Testing", () => {
  it("should retrieve all messages sent in chat application", function (done) {
    this.timeout(26813);
    chai
      .request(app)
      .get("/api/chats/messages")
      .end((err, res) => {
        console.log("==============>>>>>>>>>>>>..", res);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal("Messages retrieved successfully");
        expect(res.body.messages).to.be.an("array");
        done();
      });
  });
  it("should serve index.html", (done) => {
    chai
      .request(app)
      .get("/api/chats/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });
});
