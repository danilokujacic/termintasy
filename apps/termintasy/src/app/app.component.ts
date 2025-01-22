import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PushNotificationService } from './push-notification.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'termintasy';

  constructor(private pnService: PushNotificationService) {}
}
