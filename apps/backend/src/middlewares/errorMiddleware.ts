import { ErrorRequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/http";
import AppError from "../utils/appError";

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  // Log all errors for debugging
  console.error("❌ ERROR CAUGHT BY MIDDLEWARE:");
  console.error("Path:", req.method, req.path);
  console.error("Error:", err);
  console.error("Stack:", err.stack);
  
  if (err instanceof AppError) return handleAppError(res, err);

  return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorMiddleware;
