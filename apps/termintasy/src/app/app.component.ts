import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Messaging } from '@angular/fire/messaging';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  messaging = inject(Messaging);
  title = 'termintasy';

  constructor() {}
}
