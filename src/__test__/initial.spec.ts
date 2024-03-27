import { Request, Response } from "express";
import { expect } from "chai";
import "../app";
import { dbConnect } from "../config/db.config";
import { Home } from "../utils/functions/redirect";

before(async function () {
  this.timeout(50000);
  await dbConnect();
});

describe("Home function", () => {
  it("should respond with the welcome message", () => {
    const req = {} as Request;
    const res = {
      send: (message: string) => {
        expect(message).to.equal("Welcome to Express & TypeScript Server");
      }
    } as Response;
    Home(req, res);
  });
});
