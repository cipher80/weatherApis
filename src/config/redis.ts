import Redis from "ioredis";
import { config } from "./env";

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined
});
