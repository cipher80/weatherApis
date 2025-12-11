import axios from "axios";
import { redisClient } from "../config/redis";
import { config } from "../config/env";

export type CityWeatherSnapshot = {
  city: string;
  currentTemp: number;
  minTemp5d: number;
  maxTemp5d: number;
  warning: string | null;
  rawPayload: any;
};

export class WeatherProvider {
  private apiKey: string;
  private baseUrl: string;
  private ttlSeconds: number;

  constructor() {
    this.apiKey = config.openWeather.apiKey;
    this.baseUrl = config.openWeather.baseUrl;
    this.ttlSeconds = 300;
  }

  private cacheKey(city: string) {
    return `weather:${city.toLowerCase()}`;
  }

  private async getFromCache(city: string): Promise<CityWeatherSnapshot | null> {
    const key = this.cacheKey(city);
    const raw = await redisClient.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private async setToCache(city: string, snapshot: CityWeatherSnapshot) {
    const key = this.cacheKey(city);
    await redisClient.set(key, JSON.stringify(snapshot), "EX", this.ttlSeconds);
  }

  private async fetchCurrent(city: string) {
    const url = `${this.baseUrl}/weather`;
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: this.apiKey,
        units: "metric"
      }
    });
    return response.data;
  }

  private async fetchForecast(city: string) {
    const url = `${this.baseUrl}/forecast`;
    const response = await axios.get(url, {
      params: {
        q: city,
        appid: this.apiKey,
        units: "metric"
      }
    });
    return response.data;
  }

  async getSnapshot(city: string): Promise<CityWeatherSnapshot> {
    const cached = await this.getFromCache(city);
    if (cached) return cached;

    const [current, forecast] = await Promise.all([
      this.fetchCurrent(city),
      this.fetchForecast(city)
    ]);

    const currentTemp: number = current.main?.temp;
    const temps: number[] = Array.isArray(forecast.list)
      ? forecast.list.map((item: any) => item.main?.temp).filter((t: any) => typeof t === "number")
      : [];

    const minTemp5d = temps.length ? Math.min(...temps) : currentTemp;
    const maxTemp5d = temps.length ? Math.max(...temps) : currentTemp;

    const hasHeat = currentTemp > 35 || maxTemp5d > 35;
    const warning = hasHeat ? "HEAT_WARNING" : null;

    const snapshot: CityWeatherSnapshot = {
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
