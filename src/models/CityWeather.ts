import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  Sequelize
} from "sequelize";

export class CityWeather extends Model<
  InferAttributes<CityWeather>,
  InferCreationAttributes<CityWeather>
> {
  declare id: CreationOptional<number>;
  declare cityName: string;
  declare currentTemp: number;
  declare minTemp5d: number;
  declare maxTemp5d: number;
  declare warning: string | null;
  declare rawPayload: object | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initCityWeatherModel = (sequelize: Sequelize) => {
  CityWeather.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cityName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      currentTemp: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      minTemp5d: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      maxTemp5d: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      warning: {
        type: DataTypes.STRING,
        allowNull: true
      },
      rawPayload: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: "city_weather"
    }
  );
};
