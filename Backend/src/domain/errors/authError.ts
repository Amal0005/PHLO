export class AuthError extends Error {
  statusCode: number;
  payload?: Record<string, unknown>;

  constructor(message: string, statusCode: number, payload?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload;

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
