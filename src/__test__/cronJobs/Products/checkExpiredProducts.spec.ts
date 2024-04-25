import { expect } from "chai";
import sinon from "sinon";
import { findAllProducts, checkExpiredProducts } from "../../../utils/finders";

describe("checkExpiredProducts", () => {
  let findAllProductsStub: sinon.SinonStub<any[], any>;
  let consoleErrorStub: sinon.SinonStub<
    [message?: any, ...optionalParams: any[]],
    void
  >;

  beforeEach(() => {
    findAllProductsStub = sinon.stub().resolves([
      { id: 1, expireDate: new Date() }, // Expired product
      { id: 2, expireDate: new Date("2040-01-01") } // Not expired product
    ]);
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should handle case when no products are found", async () => {
    findAllProductsStub.resolves([]);
    await checkExpiredProducts();
    expect(consoleErrorStub.calledWith("No Products found")).to.be.true;
  });
});
