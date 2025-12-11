import { CityWeather } from "../models/CityWeather";
import { WeatherProvider, CityWeatherSnapshot } from "./WeatherProvider";
import { config } from "../config/env";

type CityAggregateResult = {
  city: string;
  currentTemperature: number;
  minTemp5d: number;
  maxTemp5d: number;
  warning: string | null;
};

type CitiesAnalyticsResponse = {
  averageTemperature: number;
  highestTemperature: {
    city: string;
    temp: number;
  };
  lowestTemperature: {
    city: string;
    temp: number;
  };
  hotCities: string[];
};

type SingleCityAnalyticsResponse = {
  city: string;
  currentTemperature: number;
  minTemp5d: number;
  maxTemp5d: number;
  warning: string | null;
};

export class WeatherAnalyticsService {
  private provider: WeatherProvider;

  constructor(provider?: WeatherProvider) {
    this.provider = provider || new WeatherProvider();
  }

  private mapSnapshot(snapshot: CityWeatherSnapshot): CityAggregateResult {
    return {
      city: snapshot.city,
      currentTemperature: snapshot.currentTemp,
      minTemp5d: snapshot.minTemp5d,
      maxTemp5d: snapshot.maxTemp5d,
      warning: snapshot.warning
    };
  }

  private async persistSnapshot(snapshot: CityWeatherSnapshot) {
    await CityWeather.upsert({
      cityName: snapshot.city,
      currentTemp: snapshot.currentTemp,
      minTemp5d: snapshot.minTemp5d,
      maxTemp5d: snapshot.maxTemp5d,
      warning: snapshot.warning,
      rawPayload: snapshot.rawPayload
    } as any);
  }

  async getCityAnalytics(city: string): Promise<SingleCityAnalyticsResponse> {
    const snapshot = await this.provider.getSnapshot(city);
    await this.persistSnapshot(snapshot);
    const mapped = this.mapSnapshot(snapshot);
    return mapped;
  }

  async getCitiesAnalytics(
    cities: string[],
    threshold?: number
  ): Promise<CitiesAnalyticsResponse> {
    const tempThreshold = typeof threshold === "number" ? threshold : config.defaults.tempThreshold;

    const snapshots = await Promise.all(
      cities.map((city) => this.provider.getSnapshot(city))
    );

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
