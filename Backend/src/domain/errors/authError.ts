export class AuthError extends Error {
  statusCode: number;
  payload?: any;

  constructor(message: string, statusCode: number, payload?: any) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload;

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
