const CustomError = require("./CustomError");

class BadRequestError extends CustomError {
  constructor(message) {
    super(message);
    this.message = message;
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
