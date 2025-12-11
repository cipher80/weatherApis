import express from "express";
import analyticsRoutes from "./routes/analytics.routes";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.use("/analytics", analyticsRoutes);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ success: false, message });
  });

  return app;
};
