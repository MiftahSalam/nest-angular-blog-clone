import { HttpStatus } from '@nestjs/common';
import { Presenter, PresenterOutput } from 'src/core/presenter';
import { CreateUserOutput } from '../output/create-user.output';

export interface CreateUserPresenterOutput extends PresenterOutput {}

export interface CreateUserPresenter extends Presenter<CreateUserOutput | {}> {
  present(
    status: HttpStatus,
    message: string,
    data: CreateUserOutput | {},
  ): Promise<CreateUserPresenterOutput>;
}

export class CreateUserPresenterImp implements CreateUserPresenter {
  present(
    status: HttpStatus,
    message: string,
    data: CreateUserOutput | {},
  ): Promise<CreateUserPresenterOutput> {
    const out: CreateUserPresenterOutput = {
      status,
      message,
      data,
    };
    return Promise.resolve(out);
  }
}
