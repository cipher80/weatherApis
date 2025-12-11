import { Request, Response, NextFunction } from "express";
import { WeatherAnalyticsService } from "../services/WeatherAnalyticsService";

type CitiesRequestBody = {
  cities: string[];
  threshold?: number;
};

export class AnalyticsController {
  private service: WeatherAnalyticsService;

  constructor(service: WeatherAnalyticsService) {
    this.service = service;
  }

  postCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CitiesRequestBody;
      const cities = Array.isArray(body.cities) ? body.cities : [];
      if (!cities.length) {
        return res.status(400).json({
          success: false,
          message: "cities is required and must be a non-empty array"
        });
      }

      const threshold = typeof body.threshold === "number" ? body.threshold : undefined;
      const analytics = await this.service.getCitiesAnalytics(cities, threshold);

      return res.json(analytics);
    } catch (err) {
      next(err);
    }
  };

  getCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = String(req.params.name || "").trim();
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "City name is required"
        });
      }

      const analytics = await this.service.getCityAnalytics(name);

      return res.json({
        city: analytics.city,
        currentTemperature: analytics.currentTemperature,
        minForecastTemperatureNext5Days: analytics.minTemp5d,
        maxForecastTemperatureNext5Days: analytics.maxTemp5d,
        warning: analytics.warning
      });
    } catch (err) {
      next(err);
    }
  };
}
