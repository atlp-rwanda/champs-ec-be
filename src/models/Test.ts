import { DataTypes, UUIDV4 } from "sequelize";
import { sequelizeConnection } from "../config/db.config";

const Test = sequelizeConnection.define("tests", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

export default Test;
