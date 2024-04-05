import { expect } from "chai";
import { matchPasswords } from "../utils/matchPasswords";

describe("matchPasswords", () => {
  it("should return true when passwords match", () => {
    const newPassword = "password";
    const confirmPassword = "password";
    const result = matchPasswords(newPassword, confirmPassword);
    expect(result).to.be.true;
  });

  it("should return false when passwords do not match", () => {
    const newPassword = "password";
    const confirmPassword = "differentPassword";
    const result = matchPasswords(newPassword, confirmPassword);
    expect(result).to.be.false;
  });

  it("should return false if newPassword is empty", () => {
    const newPassword = "";
    const confirmPassword = "password";
    const result = matchPasswords(newPassword, confirmPassword);
    expect(result).to.be.false;
  });

  it("should return false if confirmPassword is empty", () => {
    const newPassword = "password";
    const confirmPassword = "";
    const result = matchPasswords(newPassword, confirmPassword);
    expect(result).to.be.false;
  });

  it("should return false if both passwords are empty", () => {
    const newPassword = "";
    const confirmPassword = "";
    const result = matchPasswords(newPassword, confirmPassword);
    expect(result).to.be.false;
  });
});
