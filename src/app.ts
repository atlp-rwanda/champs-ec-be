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
import { validateStats } from "./validations/stats.validations";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import chatRouters from "./routes/chats.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import productCategoryRoutes from "./routes/productCategory.routes";
import cartRouter from "./routes/cart.routes";
import productWishRoutes from "./routes/wish.routes";
import { checkRole } from "./middlewares/user.middleware";
import searchRoutes from "./routes/search.routes";
import statsRoutes from "./routes/stats.routes";
import { startProductsExpirationCronJob } from "./cronjobs/crontab";
import orderRoutes from "./routes/orders.routes";
import paymentRoutes from "./routes/payment.routes";

dotenv.config();

const app: express.Application = express();

// run products expiration cron job
// eslint-disable-next-line no-unused-expressions
process.env.DEV_MODE !== "test"
  ? startProductsExpirationCronJob(
      process.env.PRODUCT_EXPIRATION_CRON_TIMER as string
    )
  : "";

// run products expiration cron job
// eslint-disable-next-line no-unused-expressions
process.env.DEV_MODE !== "test"
  ? startProductsExpirationCronJob(
      process.env.PASSWORD_EXPIRATION_CRON_TIMER as string
    )
  : "";

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
app.use("/api/users", chatRouters);
app.use("/api/users/", authRoutes);
app.use(
  "/api/stats",
  authenticate,
  checkRole(["seller"]),
  validateStats,
  statsRoutes
);
app.get("/", authenticate, Home);
app.use("/api/users", userRoutes);
app.use("/api/roles", authenticate, checkRole(["admin"]), roleRoutes);
app.use("/api/search/", searchRoutes);
app.use("/api/carts/", authenticate, checkRole(["buyer"]), cartRouter);
app.use("/api/orders/", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishes", authenticate, productWishRoutes);
app.use("/api/categories", authenticate, productCategoryRoutes);
export default app;
