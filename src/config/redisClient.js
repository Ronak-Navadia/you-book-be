import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
});

redisClient.on("connect", () => {
  console.log(
    `Connected to Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  );
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default redisClient;
