/* eslint-disable @typescript-eslint/ban-types */
import { expect } from "chai";
import sinon from "sinon";
import cron from "node-cron";
import { startPasswordExpirationCronJob } from "../../../cronjobs/crontab";
import * as passwordService from "../../../utils/checkExpiredPassword"; // Ensure the correct path

describe("startPasswordExpirationCronJob", () => {
  let cronStub: sinon.SinonStub;
  let checkExpiredPasswordsStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    cronStub = sinon.stub(cron, "schedule");
    checkExpiredPasswordsStub = sinon.stub(
      passwordService,
      "checkExpiredPasswords"
    );
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    cronStub.restore();
    checkExpiredPasswordsStub.restore();
    consoleLogStub.restore();
    consoleErrorStub.restore();
  });

  it("should schedule cron job and log success message if checkExpiredPasswords succeeds", async () => {
    checkExpiredPasswordsStub.resolves();

    startPasswordExpirationCronJob("0 0 * * *");

    const cronJobCallback = cronStub.args[0][1] as Function;
    await cronJobCallback();

    expect(cronStub.calledOnce).to.be.true;
    expect(checkExpiredPasswordsStub.calledOnce).to.be.true;
    expect(
      consoleLogStub.calledWith(
        "Expired password flaged successfully from cronjob."
      )
    ).to.be.true;
  }).timeout(5000);

  it("should schedule cron job and log error message if checkExpiredPasswords fails", async () => {
    checkExpiredPasswordsStub.rejects(new Error("Test error"));

    startPasswordExpirationCronJob("0 0 * * *");

    const cronJobCallback = cronStub.args[0][1] as Function;
    try {
      await cronJobCallback();
    } catch (err) {
      const error = err as Error;
      expect(error.message).to.equal("Error starting cronjob");
    }

    expect(cronStub.calledOnce).to.be.true;
    expect(checkExpiredPasswordsStub.calledOnce).to.be.true;
    expect(
      consoleErrorStub.calledWith(
        sinon.match.string,
        sinon.match.instanceOf(Error)
      )
    ).to.be.true;
  }).timeout(5000);
});
