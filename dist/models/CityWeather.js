"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCityWeatherModel = exports.CityWeather = void 0;
const sequelize_1 = require("sequelize");
class CityWeather extends sequelize_1.Model {
}
exports.CityWeather = CityWeather;
const initCityWeatherModel = (sequelize) => {
    CityWeather.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cityName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        currentTemp: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        minTemp5d: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        maxTemp5d: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        warning: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        },
        rawPayload: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        }
    }, {
        sequelize,
        tableName: "city_weather"
    });
};
exports.initCityWeatherModel = initCityWeatherModel;
