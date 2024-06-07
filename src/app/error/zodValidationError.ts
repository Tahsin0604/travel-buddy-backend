import { ZodError } from 'zod';
import { TError } from '../interface/errorInterface';

const zodValidationError = (err: ZodError): TError => {
  const errorString = err.issues
    .map(
      (issue) =>
        `${issue.path[issue.path.length - 1]} is ${issue.message.toLowerCase()}`,
    )
    .join('. ');
  const issues = err.issues.map((issue) => ({
    field: issue.path[issue.path.length - 1],
    message: `${issue.path[issue.path.length - 1]} is ${issue.message.toLowerCase()}`,
  }));

  return {
    statusCode: 400,
    success: false,
    message: errorString,
    errorDetails: {
      issues: issues,
    },
  };
};

export default zodValidationError;

/*
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "name"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "email"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": [
      "password"
    ],
    "message": "Required"
  },
  {
    "code": "invalid_type",
    "expected": "object",
    "received": "undefined",
    "path": [
      "profile"
    ],
    "message": "Required"
  }
] 
*/
