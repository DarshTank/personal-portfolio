import { NextResponse } from "next/server";

// In-memory store for rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Maximum 5 attempts per window

export function rateLimitMiddleware(identifier: string) {
  const now = Date.now();
  const userRateLimit = rateLimit.get(identifier) || { count: 0, timestamp: now };

  // Reset rate limit if window has passed
  if (now - userRateLimit.timestamp > RATE_LIMIT_WINDOW) {
    userRateLimit.count = 0;
    userRateLimit.timestamp = now;
  }

  // Check if rate limit exceeded
  if (userRateLimit.count >= MAX_REQUESTS) {
    const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (now - userRateLimit.timestamp)) / 1000);
    return {
      isRateLimited: true,
      timeLeft,
      message: `Too many attempts. Please try again in ${timeLeft} seconds.`,
    };
  }

  // Update rate limit
  userRateLimit.count++;
  rateLimit.set(identifier, userRateLimit);

  return {
    isRateLimited: false,
    attemptsLeft: MAX_REQUESTS - userRateLimit.count,
  };
} 