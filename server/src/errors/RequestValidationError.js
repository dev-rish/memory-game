const CustomError = require("./CustomError");

class RequestValidationError extends CustomError {
  constructor(errors) {
    super(errors[0].msg);
    this.statusCode = 400;
  }
}

module.exports = RequestValidationError;
