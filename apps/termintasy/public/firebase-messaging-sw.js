importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js'
);
const urConfigObj = {
  apiKey: 'AIzaSyAsCn-JTYjJubpQ53EyzlbMIgbFWLIpde0',
  authDomain: 'termintasy.firebaseapp.com',
  projectId: 'termintasy',
  storageBucket: 'termintasy.firebasestorage.app',
  messagingSenderId: '824710831706',
  appId: '1:824710831706:web:1955cb588a8ec30fe0c263',
  measurementId: 'G-WRYS215176',
};
firebase.initializeApp(urConfigObj);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    tag: 'notification-1',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        console.log(event);
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (
            client.url == event.notification.data.notification.click_action &&
            'focus' in client
          )
            return client.focus();
        }
        if (clients.openWindow)
          return clients.openWindow(
            event.notification.data.notification.click_action
          );
      })
  );
});
self.addEventListener('fetch', function (event) {});
