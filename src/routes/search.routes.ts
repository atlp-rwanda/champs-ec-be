import express from "express";
import { isAnonymous } from "../middlewares/user.auth";
import searchProducts from "../controllers/search.controller";

const searchRoutes = express.Router();

// Search items route
searchRoutes.get("/", isAnonymous, searchProducts);

export default searchRoutes;
