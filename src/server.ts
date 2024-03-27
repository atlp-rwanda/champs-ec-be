import { config } from "dotenv";
import app from "./app";
import { dbConnect } from "./config/db.config";
import setPort from "./utils/functions/setport";

config();
const port: string = process.env.PORT as string;

setPort(port);
dbConnect();

export default app;
