import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import roomRepository from '../repository/room.repository';
import { ApiError } from '../utils/ApiError';
import messageRepository from '../repository/message.repository';
import { filter } from '../utils/filterToUpdate';
import { emitter } from '../index';
import userRepository from '../repository/user.repository';

const create = async (req: ExpressRequest, res: ExpressResponse) => {
  const { title, userId } = req.body;

  const author = await userRepository.getById(userId);

  if (!title.trim()) {
    throw ApiError.badRequest([{ message: 'Title is required' }]);
  }

  if (!author) {
    throw ApiError.notFound([{ message: 'User not found' }]);
  }

  const rawRoom: RawRoom = {
    title,
    author: author.name,
  };

  const room: Room = await roomRepository.create(rawRoom);

  if (!room) {
    throw ApiError.internalServerError([{ message: 'Internal server error' }]);
  }

  emitter.emit('message', {
    type: 'new',
    to: 'room',
    data: room,
  });

  res.status(201).send(room);
};

const deleteRoom = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw ApiError.badRequest([{ message: 'Room id is required' }]);
  }

  await messageRepository.deleteMany(id);
  const room = await roomRepository.deleteRoom(id);

  emitter.emit('message', {
    type: 'delete',
    to: 'room',
    data: room,
  });

  res.sendStatus(204);
};

const getMessages = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw ApiError.badRequest([{ message: 'Room id required' }]);
  }

  const messages = await messageRepository.getRoomMessages(id);

  res.status(200).send(messages);
};

const change = async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const rawToChange: PartialRawRoom = { title: req.body?.title };

  if (!id || typeof id !== 'string') {
    throw ApiError.badRequest([{ message: 'Room is required' }]);
  }

  if (!rawToChange) {
    throw ApiError.badRequest([{ message: 'Changes is required' }]);
  }

  const toChange = filter(rawToChange);

  const updatedRoom = await roomRepository.change(id, toChange);

  emitter.emit('message', {
    type: 'update',
    to: 'room',
    data: updatedRoom,
  });

  res.sendStatus(204);
};

const get = async (req: ExpressRequest, res: ExpressResponse) => {
  const rooms = await roomRepository.get();

  res.status(200).send(rooms);
};

export default {
  create,
  deleteRoom,
  getMessages,
  get,
  change,
};
