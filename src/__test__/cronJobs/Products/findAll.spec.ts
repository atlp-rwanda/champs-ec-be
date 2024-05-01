import { expect } from "chai";
import sinon from "sinon";
import { findAllProducts } from "../../../utils/finders";
import Product from "../../../models/Product";

// test findAllProducts function in utils
describe("findAllProducts", () => {
  it("should return an array of products", async () => {
    const mockProducts: Product[] = [
      { id: "1", productName: "Product 1", productPrice: 100 } as Product,
      { id: "2", productName: "Product 2", productPrice: 200 } as Product
    ];
    const findAllStub = sinon.stub(Product, "findAll").resolves(mockProducts);
    const result = await findAllProducts();
    expect(result).to.be.an("array");
    expect(result).to.deep.equal(mockProducts);
    findAllStub.restore();
  });

  it("should throw an error if Product.findAll fails", async () => {
    const findAllStub = sinon
      .stub(Product, "findAll")
      .rejects(new Error("Database connection failed"));
    try {
      await findAllProducts();
      throw new Error("Expected error but none was thrown");
    } catch (error: any) {
      expect(error.message).to.equal("Couldn't Perform task at the moment");
    } finally {
      findAllStub.restore();
    }
  });

  it("Should throw an error if Product.findAll throws an error", async () => {
    const error = new Error("Database error");
    const findAllStub = sinon.stub(Product, "findAll").rejects(error);
    try {
      await findAllProducts();
      expect.fail("Expected an error to be thrown");
    } catch (err: any) {
      expect(err.message).to.equal("Couldn't Perform task at the moment");
    }
    findAllStub.restore();
  });
});
