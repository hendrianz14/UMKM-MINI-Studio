export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function badRequest(message: string) {
  throw new HttpError(400, message);
}

export function unauthorized(message = "Unauthorized") {
  throw new HttpError(401, message);
}

export function forbidden(message = "Forbidden") {
  throw new HttpError(403, message);
}

export function notFound(message = "Not Found") {
  throw new HttpError(404, message);
}
