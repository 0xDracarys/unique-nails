import { Redis } from "@upstash/redis"

// Initialize Redis client using environment variables
// Use KV_REST_API_URL and KV_REST_API_TOKEN which are in the correct format for Upstash REST API
const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

export default redis
