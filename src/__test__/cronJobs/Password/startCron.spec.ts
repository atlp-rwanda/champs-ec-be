/* eslint-disable @typescript-eslint/ban-types */
import { expect } from "chai";
import sinon from "sinon";
import cron from "node-cron";
import { startPasswordExpirationCronJob } from "../../../cronjobs/crontab";

describe("startPasswordsExpirationCronJob", () => {
  let cronStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;
  beforeEach(() => {
    cronStub = sinon.stub(cron, "schedule");

    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });
  afterEach(() => {
    cronStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();
  });
  it("should schedule cron job and log success message if checkExpiredPasswords succeeds", () => {
    startPasswordExpirationCronJob("0 0 * * *");
    const cronJobCallback = cronStub.args[0][1] as Function;
    cronJobCallback();
    expect(cronStub.calledOnce).to.be.true;
  }).timeout(5000);
  it("should schedule cron job and log error message if checkExpiredPasswords fails", () => {
    startPasswordExpirationCronJob("0 0 * * *");
    const cronJobCallback = cronStub.args[0][1] as Function;
    cronJobCallback().catch(() => {});
    expect(cronStub.calledOnce).to.be.true;
  }).timeout(5000);
});
