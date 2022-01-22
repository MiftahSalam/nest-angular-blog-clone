import { HttpStatus } from '@nestjs/common';
import { OutputDto } from './output';

export interface PresenterOutput {
  status: HttpStatus;
  message: string;
  data: any;
}
export interface Presenter<T extends OutputDto | {}> {
  present(
    status: HttpStatus,
    message: string,
    data: T | {},
  ): Promise<PresenterOutput>;
}
