import { expect } from "chai";
import sinon from "sinon";
import { findAllUsers } from "../../../utils/finders";
import User from "../../../models/user";

describe("findAllUsers", () => {
  it("should return an array of users", async () => {
    const mockUsers: User[] = [
      { id: "1", firstName: "user 1", lastName: "10" } as User,
      { id: "2", firstName: "user 2", lastName: "20" } as User
    ];
    const findAllStub = sinon.stub(User, "findAll").resolves(mockUsers);
    const result = await findAllUsers();
    expect(result).to.be.an("array");
    expect(result).to.deep.equal(mockUsers);
    findAllStub.restore();
  });
  it("should throw an error if User.findAll fails", async () => {
    const findAllStub = sinon
      .stub(User, "findAll")
      .rejects(new Error("Database connection failed"));
    try {
      await findAllUsers();
      throw new Error("Expected error but none was thrown");
    } catch (error: any) {
      expect(error.message).to.equal("Couldn't Perform task at the moment");
    } finally {
      findAllStub.restore();
    }
  }).timeout(5000);
  it("Should throw an error if User.findAll throws an error", async () => {
    const error = new Error("Database error");
    const findAllStub = sinon.stub(User, "findAll").rejects(error);
    try {
      await findAllUsers();
      expect.fail("Expected an error to be thrown");
    } catch (err: any) {
      expect(err.message).to.equal("Couldn't Perform task at the moment");
    }
    findAllStub.restore();
  }).timeout(5000);
});
