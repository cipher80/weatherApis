"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAnalyticsService = void 0;
const CityWeather_1 = require("../models/CityWeather");
const WeatherProvider_1 = require("./WeatherProvider");
const env_1 = require("../config/env");
class WeatherAnalyticsService {
    constructor(provider) {
        this.provider = provider || new WeatherProvider_1.WeatherProvider();
    }
    mapSnapshot(snapshot) {
        return {
            city: snapshot.city,
            currentTemperature: snapshot.currentTemp,
            minTemp5d: snapshot.minTemp5d,
            maxTemp5d: snapshot.maxTemp5d,
            warning: snapshot.warning
        };
    }
    async persistSnapshot(snapshot) {
        await CityWeather_1.CityWeather.upsert({
            cityName: snapshot.city,
            currentTemp: snapshot.currentTemp,
            minTemp5d: snapshot.minTemp5d,
            maxTemp5d: snapshot.maxTemp5d,
            warning: snapshot.warning,
            rawPayload: snapshot.rawPayload
        });
    }
    async getCityAnalytics(city) {
        const snapshot = await this.provider.getSnapshot(city);
        await this.persistSnapshot(snapshot);
        const mapped = this.mapSnapshot(snapshot);
        return mapped;
    }
    async getCitiesAnalytics(cities, threshold) {
        const tempThreshold = typeof threshold === "number" ? threshold : env_1.config.defaults.tempThreshold;
        const snapshots = await Promise.all(cities.map((city) => this.provider.getSnapshot(city)));
        await Promise.all(snapshots.map((s) => this.persistSnapshot(s)));
        const mapped = snapshots.map((s) => this.mapSnapshot(s));
        if (!mapped.length) {
            return {
                averageTemperature: 0,
                highestTemperature: { city: "", temp: 0 },
                lowestTemperature: { city: "", temp: 0 },
                hotCities: []
            };
        }
        const temps = mapped.map((c) => c.currentTemperature);
        const sum = temps.reduce((acc, t) => acc + t, 0);
        const averageTemperature = sum / temps.length;
        let highest = mapped[0];
        let lowest = mapped[0];
        for (let i = 1; i < mapped.length; i++) {
            const item = mapped[i];
            if (item.currentTemperature > highest.currentTemperature) {
                highest = item;
            }
            if (item.currentTemperature < lowest.currentTemperature) {
                lowest = item;
            }
        }
        const hotCities = mapped
            .filter((c) => c.currentTemperature > tempThreshold)
            .map((c) => c.city);
        return {
            averageTemperature,
            highestTemperature: {
                city: highest.city,
                temp: highest.currentTemperature
            },
            lowestTemperature: {
                city: lowest.city,
                temp: lowest.currentTemperature
            },
            hotCities
        };
    }
}
exports.WeatherAnalyticsService = WeatherAnalyticsService;
