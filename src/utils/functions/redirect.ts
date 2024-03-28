import express from "express";

export const Home = (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "Welcome to Express & TypeScript Server" });
};
