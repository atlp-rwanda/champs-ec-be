import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const db_uri: string = process.env.DB_PROD;
const APP_MODE: string = process.env.DEV_MODE || "development";

let dialect_option: any;

APP_MODE === "development"
  ? {}
  : (dialect_option = {
      ssl: {
        require: process.env.SSL,
        rejectUnauthorized: process.env.SSL
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
      console.log("Database connected successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
      process.exit(1);
    });
