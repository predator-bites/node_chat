import type { NextFunction as ExpressNextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ApiError } from '../utils/ApiError';

export const ErrorMiddleware = (
  error: Error,
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) => {
  if (error instanceof ApiError) {
    res.statusCode = error.status;
    res.statusMessage = error.message;
    res.send(error.errors);

    return;
  }

  res.statusCode = 500;
  res.send({
    errors: [
      {
        message: 'Internal server error',
      },
    ],
  });
};
