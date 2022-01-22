import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './allexception.filter';

const mockHttpAdapter = 'HttpAdapterHost';
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest.fn(),
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
};

//pending
xdescribe('All exception filter', () => {
  let exceptionService: AllExceptionsFilter;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: HttpAdapterHost,
          useFactory: () => {
            new HttpAdapterHost();
          },
        },
      ],
    }).compile();
    exceptionService = module.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  it('should be defined', () => {
    expect(exceptionService).toBeDefined();
  });

  test('should be catch http exception with proper response', () => {
    exceptionService.catch(
      new HttpException('HttpException', HttpStatus.BAD_REQUEST),
      mockArgumentsHost,
    );

    expect(mockHttpArgumentsHost).toBeCalledTimes(1);
  });
});
