import { ApiResponse } from '@motowash/shared';

export const successResponse = <T>(data?: T, meta?: any): ApiResponse<T> => {
  return {
    success: true,
    data,
    meta
  };
};

export const errorResponse = (code: string, message: string, status: number, details?: any): ApiResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
};
