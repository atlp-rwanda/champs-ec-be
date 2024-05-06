import { config } from "dotenv";
import app from "./app";
import { dbConnect } from "./config/db.config";
import setPort from "./utils/setport";
import { socketserverstart } from "./socket.notification";

config();
const port: string = process.env.PORT as string;

setPort(port);
dbConnect();
socketserverstart();

export default app;
