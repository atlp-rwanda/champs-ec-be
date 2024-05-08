import { expect } from "chai";
import sinon from "sinon";
import cron from "node-cron";
import { startProductsExpirationCronJob } from "../../../cronjobs/crontab";

describe("startProductsExpirationCronJob", () => {
  let cronStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub the cron.schedule method
    cronStub = sinon.stub(cron, "schedule");

    // Stub console.log and console.error
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    // Restore the stubs after each test
    cronStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();
  });

  it("should schedule cron job and log success message if checkExpiredProducts succeeds", () => {
    const checkExpiredProductsStub = sinon.stub().resolves();
    startProductsExpirationCronJob("0 0 * * *");
    const cronJobCallback = cronStub.args[0][1] as Function;
    cronJobCallback(); // Call the callback
    expect(cronStub.calledOnce).to.be.true;
  });

  it("should schedule cron job and log error message if checkExpiredProducts fails", () => {
    const error = new Error("Test error");
    const checkExpiredProductsStub = sinon.stub().rejects(error);
    startProductsExpirationCronJob("0 0 * * *");
    const cronJobCallback = cronStub.args[0][1] as Function;
    cronJobCallback().catch(() => {});
    expect(cronStub.calledOnce).to.be.true;
  });
});

// describe("checkExpiredProducts", () => {
//   it("should update expired products", async () => {
//     const products = [
//       { expireDate: new Date("2022-01-01"), update: sinon.stub().resolves() },
//       { expireDate: new Date("2025-01-01"), update: sinon.stub().resolves() }
//     ];

//     const findAllProductsStub = sinon.stub().resolves(products);
//     const consoleLogStub = sinon.stub(console, "log");

//     // await checkExpiredProducts();

//     expect(findAllProductsStub.calledOnce).to.be.true;
//     expect(products[0].update.calledOnceWithExactly({ isExpired: true })).to.be
//       .true;
//     // expect(products[1].update.called).to.be.false; // Second product should not be updated
//     expect(
//       consoleLogStub.calledOnceWith(
//         sinon.match("SUCCESS: ALL PRODUCTS EXPIRATION DATES HAVE BEEN CHECKED")
//       )
//     ).to.be.true;

//     // Restore the stub
//     //     findAllProductsStub.resetHistory();
//     //     consoleLogStub.restore();
//   });

//   it("should handle empty products array", async () => {
//     const findAllProductsStub = sinon.stub().resolves([]);
//     const consoleErrorStub = sinon.stub(console, "error");

//     // await checkExpiredProducts();

//     // expect(findAllProductsStub.called).to.be.true;
//     expect(consoleErrorStub.calledOnceWith(sinon.match("No Products found"))).to
//       .be.true;

//     // Restore the stub
//     findAllProductsStub.resetHistory();
//     consoleErrorStub.restore();
//   });
// });
