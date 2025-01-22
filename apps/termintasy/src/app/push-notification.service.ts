import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  messaging = inject(Messaging);
  message$: any;
  constructor(private http: HttpClient) {
    if ('Notification' in window) {
      Notification.requestPermission().then(
        (notificationPermissions: NotificationPermission) => {
          if (notificationPermissions === 'granted') {
            console.log('Granted');
          }
          if (notificationPermissions === 'denied') {
            console.log('Denied');
          }
        }
      );
    } else {
      console.error('Notifications are not supported in this browser.');
    }

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js', {
        type: 'module',
      })
      .then((serviceWorkerRegistration) => {
        getToken(this.messaging, {
          vapidKey: `BOFMA8d-khvtMqYCm6PvnC5lRHSf6YRiH77h39caEK0tpNqx7LeaFmghmU0vR9h-X10p4O6sff4KNLm6gc5k8m8`,
          serviceWorkerRegistration: serviceWorkerRegistration,
        }).then((x) => {
          console.log(x);
          this.http
            .post(environment.apiUrl + '/push-notification/save-token', {
              token: x,
            })
            .subscribe();
          // This is a good place to then store it on your database for each user
        });
      });
    this.message$ = new Observable((sub) =>
      onMessage(this.messaging, (msg) => sub.next(msg))
    ).pipe(
      tap((msg) => {
        console.log('My Firebase Cloud Message', msg);
      })
    );
  }
}
