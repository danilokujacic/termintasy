import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-sw.js';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAsCn-JTYjJubpQ53EyzlbMIgbFWLIpde0',
  authDomain: 'termintasy.firebaseapp.com',
  projectId: 'termintasy',
  storageBucket: 'termintasy.firebasestorage.app',
  messagingSenderId: '824710831706',
  appId: '1:824710831706:web:1955cb588a8ec30fe0c263',
  measurementId: 'G-WRYS215176',
});

const messaging = getMessaging(firebaseApp);
