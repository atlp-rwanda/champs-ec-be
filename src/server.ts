import { config } from "dotenv";
import app from "./app";
import { dbConnect } from "./config/db.config";
import { socketserverstart } from "./socket.notification";

config();

const port: string = process.env.PORT as string;
const server = app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

dbConnect();

socketserverstart(server);

export default app;
