const CustomError = require("../errors/CustomError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message }
    });
  }

  console.error(err);

  return res.status(500).send({
    success: false,
    error: { message: "Something went wrong" }
  });
};

module.exports = errorHandler;
