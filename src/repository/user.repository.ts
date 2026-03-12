import { prisma } from '../db';

const create = (name: string) => {
  return prisma.user.create({
    data: {
      name,
    },
  });
};

const getById = (id: string) => {
  return prisma.user.findFirst({
    where: {
      id,
    },
  });
};

const getByName = (name: string) => {
  return prisma.user.findFirst({
    where: {
      name,
    },
  });
};

export default {
  create,
  getById,
  getByName,
};
