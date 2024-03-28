import { Model, DataTypes } from "sequelize";
import { sequelizeConnection } from "../config/db.config";
import { TestAttributes, TestCreationAttributes } from "../types/test.type";

class Test
  extends Model<TestAttributes, TestCreationAttributes>
  implements TestAttributes
{
  public id!: string;

  public titles!: string;

  public createdAt!: Date;

  public updatedAt!: Date;
}

Test.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    timestamps: true,
    sequelize: sequelizeConnection,
    modelName: "Test",
    tableName: "tests"
  }
);

export default Test;
