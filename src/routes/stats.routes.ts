import express from "express";
import { getGeneralStats } from "../controllers/stats.controller";

const statsRoutes = express.Router();

statsRoutes.route("/").get(getGeneralStats);

export default statsRoutes;
