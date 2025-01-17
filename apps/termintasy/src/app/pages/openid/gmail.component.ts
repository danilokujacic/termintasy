import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gmail',
  imports: [CommonModule],

  templateUrl: './gmail.component.html',
  styleUrl: './gmail.component.css',
})
export class GmailComponent implements OnInit {
  accessToken = '';
  http = inject(HttpClient);
  router = inject(Router);
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    // Get the fragment part of the URL
    const fragment = this.route.snapshot.fragment;

    if (fragment) {
      // Regular expression to extract the access_token
      const accessTokenMatch = fragment.match(/access_token=([^&]+)/);

      if (accessTokenMatch && accessTokenMatch[1]) {
        this.accessToken = accessTokenMatch[1]; // Store the access token
        localStorage.removeItem('token');
        this.http
          .get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: 'Bearer ' + this.accessToken,
            },
          })
          .pipe(
            switchMap((data) =>
              this.http.post<{ token: string }>(
                environment.apiUrl + '/auth/oidc/gmail/login',
                data
              )
            )
          )
          .subscribe((data) => {
            localStorage.setItem('token', data.token);
            this.router.navigate(['']);
          });
      } else {
        console.error('Access token not found in the URL fragment.');
      }
    }
  }
}
