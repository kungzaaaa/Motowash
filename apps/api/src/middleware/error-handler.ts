import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { errorResponse } from '../utils/api-response';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      errorResponse(err.code, err.message, err.statusCode)
    );
  }

  // Handle generic errors
  const isProduction = config.NODE_ENV === 'production';
  return res.status(500).json(
    errorResponse(
      'INTERNAL_SERVER_ERROR',
      isProduction ? 'Something went wrong' : err.message,
      500
    )
  );
};
