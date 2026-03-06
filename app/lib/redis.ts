import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// initialize Redis and creates a "client" that talks to our Upstash Redis database using the REST API
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,   //! tells TypeScript that we are sure this variable is defined,they arent empty
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});