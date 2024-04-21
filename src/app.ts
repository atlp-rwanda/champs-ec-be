import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import session from "express-session";
import dotenv from "dotenv";
import { Home } from "./utils/redirect";
import swaggerDocument from "../swagger.json";
import userRoutes from "./routes/user.routes";
import roleRoutes from "./routes/role.routes";
import passport from "./config/passport.config";
import { authenticate } from "./middlewares/user.auth";
import chatsRoutes from "./routes/chats.routes";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isAdmin } from "./middlewares/user.middleware";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import productCategoryRoutes from "./routes/productCategory.routes";

dotenv.config();

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(passport.initialize());
app.use(passport.session());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", authenticate, Home);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users/", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/categories", productCategoryRoutes);

app.use("/api", chatsRoutes);
export default app;
