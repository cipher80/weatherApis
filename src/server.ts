import { createApp } from "./app";
import { sequelize } from "./models";
import { config } from "./config/env";
import { redisClient } from "./config/redis";

const app = createApp();

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await redisClient.ping();

    app.listen(config.port, () => {
      console.log(`Weather Analytics API running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Startup error", err);
    process.exit(1);
  }
};

start();
