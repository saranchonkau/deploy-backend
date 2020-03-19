/**
 * Custom Node.js Error
 * Source: https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216
 */
class ApplicationError extends Error {
  status: number;

  constructor(message: string, status?: number) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status ?? 500;
  }
}

export default ApplicationError