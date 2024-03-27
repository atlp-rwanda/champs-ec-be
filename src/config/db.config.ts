import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

let db_uri: string = "";
const APP_MODE: string = (process.env.DEV_MODE as string) || "development";
const DB_HOST_MODE: string = process.env.DB_HOST_TYPE as string;

let dialect_option: any;

switch (APP_MODE) {
  case "test":
    db_uri = process.env.DB_TEST as string;
    break;

  case "production":
    db_uri = process.env.DB_PROD as string;
    break;
  default:
    db_uri = process.env.DB_DEV as string;
    break;
}

DB_HOST_MODE == "local"
  ? (dialect_option = {})
  : (dialect_option = {
      ssl: {
        require: process.env.SSL,
        rejectUnauthorized: true
      }
    });

export const sequelizeConnection: Sequelize = new Sequelize(db_uri, {
  dialect: "postgres",
  dialectOptions: dialect_option,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const dbConnect = () =>
  sequelizeConnection
    .authenticate()
    .then(() => {
      console.log("Database connected successfully.", db_uri);
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
    });
