import { prisma } from '../db';

const getMessages = () => {
  return prisma.message.findMany();
};

const getRoomMessages = (roomId: string) => {
  return prisma.message.findMany({ where: { roomId } });
};

const create = (rawMessage: RawMessage) => {
  return prisma.message.create({
    data: rawMessage,
  });
};

const deleteMessage = (messageId: string) => {
  return prisma.message.delete({
    where: {
      id: messageId,
    },
  });
};

const deleteMany = (roomId: string) => {
  return prisma.message.deleteMany({ where: { roomId } });
};

export default {
  getMessages,
  getRoomMessages,
  create,
  deleteMessage,
  deleteMany,
};
