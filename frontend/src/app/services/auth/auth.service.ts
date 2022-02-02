import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

import { UserRole } from '../../models/Role.model';

interface UserJwtDto {
  username: string;
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject$: BehaviorSubject<UserJwtDto>;

  constructor() {
    this.login(); //sementara
    this.currentUserSubject$ = new BehaviorSubject<UserJwtDto>(
      JSON.parse(localStorage.getItem('user') || '{}')
    );
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.currentUserSubject$.asObservable().pipe(
      switchMap((user) => {
        // console.log(user);

        return of(user.username !== undefined);
      })
    );
  }

  login() {
    //sementara
    localStorage.setItem(
      'user',
      JSON.stringify({
        username: 'mifatah',
        sub: 'sdfsdf',
        role: 'user',
        iat: 1643695022,
        exp: 1643695182,
      } as UserJwtDto)
    );
  }
}
