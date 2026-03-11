export class ApiError extends Error {
  status: number;
  errors: ErrorObject;

  constructor(message: string, status: number, errors: ErrorObject) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(messages: ErrorMessage[]) {
    return new ApiError('Bad request', 400, { errors: messages });
  }

  static notFound(messages: ErrorMessage[]) {
    return new ApiError('Not found', 404, { errors: messages });
  }

  static conflict(messages: ErrorMessage[]) {
    return new ApiError('Conflict', 409, { errors: messages});
  }

  static internalServerError(messages: ErrorMessage[]) {
    return new ApiError('Internal server error', 500, { errors: messages });
  }

  static forbidden(messages: ErrorMessage[]) {
    return new ApiError('Access denied', 403, { errors: messages});
  }
}
