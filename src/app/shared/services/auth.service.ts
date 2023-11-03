import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export interface IUser {
  email: string;
  avatarUrl?: string;
}

const defaultPath = '/';
const defaultUser = {
  email: 'sandra@example.com',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService {
  private _user: IUser | null = defaultUser;
  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router) { }

  async logIn(email: string, password: string) {

    try {
      // Send request
      this._user = { ...defaultUser, email };
      this.router.navigate([this._lastAuthenticatedPath]);

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false,
        message: "Authentication failed"
      };
    }
  }

  async getUser() {
    try {
      // Send request

      return {
        isOk: true,
        data: this._user
      };
    }
    catch {
      return {
        isOk: false,
        data: null
      };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      // Send request

      this.router.navigate(['/create-account']);
      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  }

  async logOut() {
    this._user = null;
    this.router.navigate(['/login-form']);
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService,private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        //alert("You are currently not logged in, please provide Login!")
        this.router.navigate(['/login-form'], { queryParams: { returnUrl: state.url } }).then(() => {
            window.location.reload();
          });
        return false;
    // //const isLoggedIn = this.authService.loggedIn;
    // const isLoggedIn = this.authenticationService.currentUserValue!=null;
    // const isAuthForm = [
    //   'login-form',
    //   'reset-password',
    //   'create-account',
    //   'change-password/:recoveryCode'
    // ].includes(route.routeConfig?.path || defaultPath);

    // if (isLoggedIn && isAuthForm) {
    //   this.authService.lastAuthenticatedPath = defaultPath;
    //   this.router.navigate([defaultPath]);
    //   return false;
    // }

    // if (!isLoggedIn && !isAuthForm) {
    //   this.router.navigate(['/login-form']);
    // }

    // if (isLoggedIn) {
    //   this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    // }

    // return isLoggedIn || isAuthForm;
  }
}
