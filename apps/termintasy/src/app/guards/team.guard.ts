import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
class TeamGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}
  canActivate() {
    return this.userService.me().pipe(
      map((user: any) => {
        console.log(user);
        if (!user.userTeam) {
          this.router.navigate(['create-team']);
          return false;
        }

        return true;
      })
    );
  }
}

export default TeamGuard;
