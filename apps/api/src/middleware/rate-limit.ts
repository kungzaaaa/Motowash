import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';

interface RateLimitConfig {
  windowMs: number;
  max: number;
}

const memoryStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (options: RateLimitConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    const record = memoryStore.get(key);
    
    if (!record || now > record.resetTime) {
      memoryStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      });
      return next();
    }
    
    record.count++;
    
    if (record.count > options.max) {
      return next(new ApiError(429, 'TOO_MANY_REQUESTS', 'Too many requests, please try again later'));
    }
    
    next();
  };
};
