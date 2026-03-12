import type { Request, Response } from 'express';
import messageRepository from '../repository/message.repository';
import roomRepository from '../repository/room.repository';
import { ApiError } from '../utils/ApiError';
import { emitter } from '../index';
import userRepository from '../repository/user.repository';

const getMessages = async (req: Request, res: Response) => {
  const messages = await messageRepository.getMessages();

  if (!messages) {
    throw ApiError.internalServerError([{ message: 'Internal server error' }]);
  }

  res.status(200).send(messages);
};

const create = async (req: Request, res: Response) => {
  const { userId, text, roomId } = req.body;

  if (!userId || !text) {
    throw ApiError.badRequest([{ message: 'UserId and text is required' }]);
  }

  const author = await userRepository.getById(userId);

  if (!author) {
    throw ApiError.notFound([{ message: 'User not found' }]);
  }

  const rawMessage: RawMessage = { author: author.name, text };

  if (roomId) {
    if (!(await roomRepository.getById(roomId))) {
      throw ApiError.notFound([{ message: 'Room not found' }]);
    }

    rawMessage['roomId'] = roomId;
  }

  const message = await messageRepository.create(rawMessage);

  if (!message) {
    throw ApiError.internalServerError([{ message: 'Internal server error' }]);
  }

  emitter.emit('message', {
    type: 'new',
    to: 'messages',
    data: message,
  });

  res.status(201).send(message);
};

const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw ApiError.badRequest([{ message: 'Bad request, id not found' }]);
  }

  const deleted = await messageRepository.deleteMessage(id);

  if (!deleted) {
    throw ApiError.notFound([{ message: 'Message not found' }]);
  }

  res.sendStatus(204);
};

export default {
  getMessages,
  create,
  deleteMessage,
};
