import type {
  NextFunction as ExpressNextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

type AsyncHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) => Promise<void>;

export function catchAsync(fn: AsyncHandler) {
  return (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction,
  ) => fn(req, res, next).catch(next);
}
