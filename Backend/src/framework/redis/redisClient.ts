import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

redis.on("connect", () => console.log("Redis Connected"));
redis.on("error", (err) => console.log("Redis Error:", err));

export default redis;
