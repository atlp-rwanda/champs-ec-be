import { Request, Response } from "express";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../app";
import { dbConnect } from "../config/db.config";

chai.use(chaiHttp);

before(async function () {
  this.timeout(50000);
  await dbConnect();
});

describe("test a home route", () => {
  it("should respond with the welcome message", () => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
  });
});

describe("test a user signup endpoint", () => {
  it("should return user exist", () => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: "tchami123@gmail.com"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(409);
      });
  });

  it("it should test a user validation fail", () => {
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: "tchami123@gmaicom"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(403);
      });
  });

  /*
  it("it should create a user succesful", () => {
    const r = (Math.random() + 1).toString(36).substring(5);
    const userEmail = `u${r}@gmail.com`;
    console.log(userEmail);
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName: "Tchami",
        password: "Test@12345",
        email: userEmail
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
      });
  });
 
  it("it should test internal server error", () => {
    const r = (Math.random() + 1).toString(36).substring(5);
    const userEmail = `user${r}@gmail.com`;
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        firstName: "Ernest",
        lastName:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen bookLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
        password: "Test@12345",
        email: userEmail
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
      });
  });
  */
});

/*
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
*/
