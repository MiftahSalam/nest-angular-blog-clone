import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: BehaviorSubject<boolean>;
  logString: string = 'Login';

  constructor(private readonly authService: AuthService) {
    this.isLoggedIn$ = new BehaviorSubject<boolean>(false);
    authService.isUserLoggedIn.subscribe((isLoggedIn) =>
      this.isLoggedIn$.next(isLoggedIn)
    );
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn.subscribe((isLoggedIn) => {
      console.log(isLoggedIn);
      this.isLoggedIn$.next(isLoggedIn);
    });
    this.changeLogString();
  }

  onLogClick() {
    if (this.isLoggedIn$.value) this.onLogout();
    else this.onLogin();
  }

  private onLogin() {
    console.log('onLogin');
  }

  private onLogout() {
    console.log('onLogout');
  }

  private changeLogString() {
    this.logString = this.isLoggedIn$.value ? 'Logout' : 'Login';
  }
}
