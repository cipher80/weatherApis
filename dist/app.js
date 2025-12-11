"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/analytics", analytics_routes_1.default);
    app.use((err, _req, res, _next) => {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ success: false, message });
    });
    return app;
};
exports.createApp = createApp;
