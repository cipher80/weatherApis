"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || "3000", 10),
    db: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        name: process.env.DB_NAME || "weather_db",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres"
    },
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD || ""
    },
    openWeather: {
        apiKey: process.env.OPENWEATHER_API_KEY || "",
        baseUrl: "https://api.openweathermap.org/data/2.5"
    },
    defaults: {
        tempThreshold: parseFloat(process.env.DEFAULT_TEMP_THRESHOLD || "30")
    }
};
