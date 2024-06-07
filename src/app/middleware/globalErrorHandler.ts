/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { TError } from '../interface/errorInterface';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import zodValidationError from '../error/zodValidationError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errorResponse: TError = {
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    message: err?.message,
    errorDetails: err,
  };
  if (err instanceof ZodError) {
    const formattedError = zodValidationError(err);
    errorResponse.statusCode = formattedError.statusCode;
    errorResponse.success = formattedError.success;
    errorResponse.message = formattedError.message;
    errorResponse.errorDetails = formattedError.errorDetails;
  }

  if (err?.statusCode === 401) {
    errorResponse.message = 'Unauthorized Access';
    errorResponse.errorDetails = err?.stack;
  }

  res.status(errorResponse.statusCode).json({
    success: errorResponse?.success,
    message: errorResponse?.message,
    errorDetails: errorResponse?.errorDetails,
  });
};

export default globalErrorHandler;
