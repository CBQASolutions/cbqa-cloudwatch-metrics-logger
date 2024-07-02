enum StatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
}

type ApiError = {
  error: Error;
  message: string;
};

export class BackendCustomException extends Error {
  public static clientMessage = 'Ocurrió un error al procesar la petición';
  public static errorCode = 500;
  public static httpStatus = StatusCodes.SERVER_ERROR;

  public originalError: Error;
  public errorCode: number;
  public httpStatus: StatusCodes;
  public clientMessage: string;
  public internalMessage: string;

  constructor(error: Error, clientMessage: string | null = null) {
    if (error instanceof BackendCustomException) {
      super(error.internalMessage);
      this.originalError = error.originalError;
      this.errorCode = error.errorCode;
      this.httpStatus = error.httpStatus;
      this.clientMessage = error.clientMessage;
      this.internalMessage = error.internalMessage;
    } else {
      super(error.message);
      const constructor = this.getConstructor();
      this.originalError = error;
      this.errorCode = constructor.errorCode;
      this.httpStatus = constructor.httpStatus;
      this.clientMessage = clientMessage || constructor.clientMessage;
      this.internalMessage = error.message;
    }
  }

  private getConstructor<T extends typeof BackendCustomException>() {
    return this.constructor as T;
  }

  static throw(clientMessage = this.clientMessage) {
    const error = new Error(clientMessage);

    throw new this(error);
  }

  static create(clientMessage = this.clientMessage) {
    const error = new Error(clientMessage);

    return new this(error);
  }

  static transformErrorToException(error: unknown): ApiError {
    const err = error as Error;
    return {
      error: err,
      message: err.message,
    };
  }
}

/**
 * Cloudwatch Exceptions (500.)
 */

export class IncreaseFunctionMetricException extends BackendCustomException {
  public static errorCode = 500.1;
  public static clientMessage = 'Failed to send metric data';

  constructor(originalError: Error) {
    super(originalError);
  }
}

export class IncreaseErrorMetricException extends BackendCustomException {
  public static errorCode = 500.2;
  public static clientMessage = 'Failed to send metric erro data';

  constructor(originalError: Error) {
    super(originalError);
  }
}
