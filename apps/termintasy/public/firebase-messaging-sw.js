importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');
const firebaseConfig = {
  apiKey: 'AIzaSyAsCn-JTYjJubpQ53EyzlbMIgbFWLIpde0',
  authDomain: 'termintasy.firebaseapp.com',
  projectId: 'termintasy',
  storageBucket: 'termintasy.firebasestorage.app',
  messagingSenderId: '824710831706',
  appId: '1:824710831706:web:1955cb588a8ec30fe0c263',
  measurementId: 'G-WRYS215176',
}; // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
self.addEventListener('notificationclick', (event) => {
  console.log(event);
});
