import { HttpStatus } from '@nestjs/common';

export class PresenterOutput {
  status: HttpStatus;
  message: string;
  data: any;
}
