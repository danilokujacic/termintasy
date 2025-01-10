import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = new FormControl('');
  password = new FormControl('');
  router = inject(Router);

  gmailLogin() {
    window.location.assign(
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
        environment.clientId +
        '&redirect_uri=https://app.terminta.xyz/oauth/gmail/redirect&response_type=token&scope=openid profile email'
    );
  }
}
