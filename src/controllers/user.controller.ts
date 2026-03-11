import type { Request, Response } from "express";
import userRepository from "../repository/user.repository";
import { ApiError } from "../utils/ApiError";

const create = async (req: Request, res: Response) => {
  const { userName } = req.body;

  if (!userName) {
    throw ApiError.badRequest([{ message: 'Username is required'}]);
  }

  if (await userRepository.getByName(userName)) {
    throw ApiError.conflict([{ message: 'Username has already been registered'}]);
  }

  const user = await userRepository.create(userName);

  res.status(201).send(user);
}

export default {
  create
}
