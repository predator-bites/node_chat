import { prisma } from '../db.ts';

const getById = (id: string) => {
  return prisma.room.findFirst({
    where: {
      id,
    },
  });
};

const get = () => {
  return prisma.room.findMany();
};

const create = (rawRoom: RawRoom) => {
  return prisma.room.create({
    data: rawRoom,
  });
};

const deleteRoom = (roomId: string) => {
  return prisma.room.delete({ where: { id: roomId } });
};

const change = (id: string, toChange: PartialRawRoom) => {
  return prisma.room.update({
    where: {
      id,
    },
    data: toChange,
  });
};

export default {
  get,
  getById,
  create,
  deleteRoom,
  change,
};
