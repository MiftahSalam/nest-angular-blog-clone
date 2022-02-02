import { ErrorHandler } from '@angular/core';

export class CustomErrorHandle implements ErrorHandler {
  handleError(error: any): void {
    alert(error);
  }
}
