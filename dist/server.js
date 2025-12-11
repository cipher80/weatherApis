"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const models_1 = require("./models");
const env_1 = require("./config/env");
const redis_1 = require("./config/redis");
const app = (0, app_1.createApp)();
const start = async () => {
    try {
        await models_1.sequelize.authenticate();
        await models_1.sequelize.sync();
        await redis_1.redisClient.ping();
        app.listen(env_1.config.port, () => {
            console.log(`Weather Analytics API running on port ${env_1.config.port}`);
        });
    }
    catch (err) {
        console.error("Startup error", err);
        process.exit(1);
    }
};
start();
