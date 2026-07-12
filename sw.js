// sw.js — Anuj Classes Live Test · Push Notification Service Worker
// Place this file in the same directory as index.html (the web root).

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Anuj Classes', body: event.data ? event.data.text() : 'New notification' };
  }

  const title = data.title || 'Anuj Classes';
  const options = {
    body:  data.body  || 'A test is starting soon!',
    icon:  data.icon  || '/favicon.ico',   // update path if you have an icon
    badge: data.badge || '/favicon.ico',
    tag:   data.tag   || 'anuj-test-reminder',
    renotify: true,
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus an existing tab if one is open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
