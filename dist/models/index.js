"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityWeather = exports.sequelize = void 0;
const database_1 = require("../config/database");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return database_1.sequelize; } });
const CityWeather_1 = require("./CityWeather");
Object.defineProperty(exports, "CityWeather", { enumerable: true, get: function () { return CityWeather_1.CityWeather; } });
(0, CityWeather_1.initCityWeatherModel)(database_1.sequelize);
