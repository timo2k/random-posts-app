import { HttpException, HttpStatus } from '@nestjs/common';

export class VoteLimitException extends HttpException {
  constructor() {
    super('You have already voted 10 times.', HttpStatus.BAD_REQUEST);
  }
}
