import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate() {
    const isAdmin = this.userService.user().admin;

    if (!isAdmin) {
      this.router.navigate(['']);

      return false;
    }
    return true;
  }
}

export default AdminGuard;
