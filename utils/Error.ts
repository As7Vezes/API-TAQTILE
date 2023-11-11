import { ApolloError } from 'apollo-server-errors';

export class MyError extends ApolloError {
  private readonly errorCode: string;
  private readonly additionalInfo?: string;

  constructor(message: string, code: string, additionalInfo?: string) {
    super(message, code);

    this.errorCode = code;
    this.additionalInfo = additionalInfo;

    Object.defineProperty(this, 'name', { value: 'MyError' });
  }

  getErrorDetails(): { message: string; code: string; additionalInfo?: string } {
    return {
      message: this.message,
      code: this.errorCode,
      additionalInfo: this.additionalInfo,
    };
  }
}
