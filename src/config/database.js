const dotenv = require("dotenv");

dotenv.config();
module.exports = {
  development: {
    url: process.env.DB_DEV
  },
  test: {
    url: process.env.DB_TEST
  },
  production: {
    url: process.env.DB_PROD
  }
};
