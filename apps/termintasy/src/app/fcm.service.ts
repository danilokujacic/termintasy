import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Observable, tap } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  message$ = new Observable((sub) =>
    onMessage(this.msg, (msg) => sub.next(msg))
  ).pipe(
    tap((msg) => {
      console.log('My Firebase Cloud Message', msg);
    })
  );

  constructor(private msg: Messaging, private http: HttpClient) {
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
    navigator.serviceWorker
      .register('firebase-messaging-sw.js', {
        type: 'module',
      })
      .then((serviceWorkerRegistration) => {
        getToken(this.msg, {
          vapidKey: `BOFMA8d-khvtMqYCm6PvnC5lRHSf6YRiH77h39caEK0tpNqx7LeaFmghmU0vR9h-X10p4O6sff4KNLm6gc5k8m8`,
          serviceWorkerRegistration: serviceWorkerRegistration,
        }).then((x) => {
          this.http.post(environment.apiUrl + '/push-notification/send-token', {
            token: x,
          });
          // This is a good place to then store it on your database for each user
        });
      });
  }
}
