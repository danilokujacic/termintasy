import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MessagePayload,
  Messaging,
  getToken,
  onMessage,
} from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private messageSource = new BehaviorSubject<MessagePayload | null>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private messaging: Messaging, private http: HttpClient) {}

  requestPermission() {
    return getToken(this.messaging, {
      vapidKey:
        'BOFMA8d-khvtMqYCm6PvnC5lRHSf6YRiH77h39caEK0tpNqx7LeaFmghmU0vR9h-X10p4O6sff4KNLm6gc5k8m8',
    })
      .then((token) => {
        this.http
          .post(environment.apiUrl + '/push-notification/save-token', {
            token,
          })
          .subscribe();

        console.log(token);
      })
      .catch((err) => {
        console.error('Permission denied', err);
      });
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received. ', payload);
      this.messageSource.next(payload);
    });
  }
}
