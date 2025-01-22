importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAsCn-JTYjJubpQ53EyzlbMIgbFWLIpde0',
  authDomain: 'termintasy.firebaseapp.com',
  projectId: 'termintasy',
  storageBucket: 'termintasy.firebasestorage.app',
  messagingSenderId: '824710831706',
  appId: '1:824710831706:web:1955cb588a8ec30fe0c263',
  measurementId: 'G-WRYS215176',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = 'Background Message from html';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
