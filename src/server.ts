import { config } from "dotenv";
import app from "./app";
import { dbConnect } from "./config/db.config";
import { socketserverstart } from "./socket.notification";
import { createPublicChatroom } from "./services/chats.services";

config();

const port: string = process.env.PORT as string;
const server = app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});

dbConnect();
// eslint-disable-next-line no-unused-expressions
process.env.DEV_MODE !== "test" ? createPublicChatroom() : "";
socketserverstart(server);

export default app;
