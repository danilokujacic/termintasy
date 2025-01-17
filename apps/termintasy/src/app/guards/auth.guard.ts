import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['login']);
      return false;
    }

    return this.userService.me().pipe(map((user) => !!user));
  }
}

export default AuthGuard;
