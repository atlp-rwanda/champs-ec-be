import express from "express";

export const Home = (req: express.Request, res: express.Response) => {
  res.send("Welcome to Express & TypeScript Server");
};
