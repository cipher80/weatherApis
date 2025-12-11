"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../config/redis");
const env_1 = require("../config/env");
class WeatherProvider {
    constructor() {
        this.apiKey = env_1.config.openWeather.apiKey;
        this.baseUrl = env_1.config.openWeather.baseUrl;
        this.ttlSeconds = 300;
    }
    cacheKey(city) {
        return `weather:${city.toLowerCase()}`;
    }
    async getFromCache(city) {
        const key = this.cacheKey(city);
        const raw = await redis_1.redisClient.get(key);
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    async setToCache(city, snapshot) {
        const key = this.cacheKey(city);
        await redis_1.redisClient.set(key, JSON.stringify(snapshot), "EX", this.ttlSeconds);
    }
    async fetchCurrent(city) {
        const url = `${this.baseUrl}/weather`;
        const response = await axios_1.default.get(url, {
            params: {
                q: city,
                appid: this.apiKey,
                units: "metric"
            }
        });
        return response.data;
    }
    async fetchForecast(city) {
        const url = `${this.baseUrl}/forecast`;
        const response = await axios_1.default.get(url, {
            params: {
                q: city,
                appid: this.apiKey,
                units: "metric"
            }
        });
        return response.data;
    }
    async getSnapshot(city) {
        const cached = await this.getFromCache(city);
        if (cached)
            return cached;
        const [current, forecast] = await Promise.all([
            this.fetchCurrent(city),
            this.fetchForecast(city)
        ]);
        const currentTemp = current.main?.temp;
        const temps = Array.isArray(forecast.list)
            ? forecast.list.map((item) => item.main?.temp).filter((t) => typeof t === "number")
            : [];
        const minTemp5d = temps.length ? Math.min(...temps) : currentTemp;
        const maxTemp5d = temps.length ? Math.max(...temps) : currentTemp;
        const hasHeat = currentTemp > 35 || maxTemp5d > 35;
        const warning = hasHeat ? "HEAT_WARNING" : null;
        const snapshot = {
            city,
            currentTemp,
            minTemp5d,
            maxTemp5d,
            warning,
            rawPayload: {
                current,
                forecast
            }
        };
        await this.setToCache(city, snapshot);
        return snapshot;
    }
}
exports.WeatherProvider = WeatherProvider;
