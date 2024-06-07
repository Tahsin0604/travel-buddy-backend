import { Response } from 'express';
type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T | T[];
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  res.status(responseData?.statusCode as number).json({
    success: responseData?.success,
    statusCode: responseData.statusCode,
    message: responseData?.message,
    meta: responseData?.meta,
    data: responseData?.data,
  });
};

export default sendResponse;
