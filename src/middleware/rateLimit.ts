import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

// Disable rate limiting entirely in test mode
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 999999 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isTest ? 999999 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});
