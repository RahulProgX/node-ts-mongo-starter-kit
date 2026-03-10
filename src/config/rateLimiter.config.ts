import { rateLimit } from "express-rate-limit";

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // max 100 requests per window
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export default globalRateLimiter;
