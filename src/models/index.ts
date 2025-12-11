import { sequelize } from "../config/database";
import { CityWeather, initCityWeatherModel } from "./CityWeather";

initCityWeatherModel(sequelize);

export { sequelize, CityWeather };
