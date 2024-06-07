export type TError = {
  statusCode: number;
  success: boolean;
  message: string;
  errorDetails: object | null | string;
};
