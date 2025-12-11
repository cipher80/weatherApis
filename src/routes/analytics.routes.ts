import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController";
import { WeatherAnalyticsService } from "../services/WeatherAnalyticsService";

const router = Router();
const service = new WeatherAnalyticsService();
const controller = new AnalyticsController(service);

router.post("/cities", controller.postCities);
router.get("/city/:name", controller.getCity);

export default router;
