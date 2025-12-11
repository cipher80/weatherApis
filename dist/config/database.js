"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
exports.sequelize = new sequelize_1.Sequelize(env_1.config.db.name, env_1.config.db.user, env_1.config.db.password, {
    host: env_1.config.db.host,
    port: env_1.config.db.port,
    dialect: "postgres",
    logging: false
});
