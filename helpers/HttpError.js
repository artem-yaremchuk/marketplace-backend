const messageList = {
  400: "Bad Request: The server could not understand the request due to invalid syntax",
  401: "Unauthorized: Authentication is required or has failed",
  403: "Forbidden: You do not have permission to access this resource",
  404: "Not Found: The requested resource could not be found on this server",
  409: "Conflict: The request conflicts with the current state of the server",
  500: "Internal Server Error: An unexpected error occurred on the server",
};

const HttpError = (status, message = messageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpError;