import type { NextFunction as ExpressNextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import roomRepository from '../repository/room.repository';
import { ApiError } from '../utils/ApiError';
import userRepository from '../repository/user.repository';
export const permissionMiddleware = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) => {
  const { id } = req.params;
  const userId = req.headers['x-userid'];

  if (!id || typeof id !== 'string' || !(await roomRepository.getById(id))) {
    throw ApiError.badRequest([{ message: 'Id is required' }]);
  }

  if (!userId || typeof userId !== 'string') {
    throw ApiError.badRequest([{ message: 'User id is required' }]);
  }

  const author = await userRepository.getById(userId);
  const roomToDelete = await roomRepository.getById(id);

  if (!author) {
    throw ApiError.notFound([{ message: 'User not found' }]);
  }

  if (!roomToDelete) {
    throw ApiError.notFound([{ message: 'Room not found' }]);
  }

  if (roomToDelete.author !== author.name) {
    throw ApiError.forbidden([{ message: 'Access denied' }]);
  }

  next();
};
