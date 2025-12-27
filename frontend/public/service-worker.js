// const CACHE_NAME = "absensi-gembira-v2";
// const BASE_PATH = "/custom_hrms/";
// const urlsToCache = [
//   `${BASE_PATH}`,
//   `${BASE_PATH}index.html`,
//   `${BASE_PATH}manifest.json`,
//   `${BASE_PATH}icons/splash.png`,
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
//   console.log("🪄 Service Worker installed for", BASE_PATH);
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames
//           .filter((name) => name !== CACHE_NAME)
//           .map((name) => caches.delete(name))
//       )
//     )
//   );
//   console.log("🔥 Service Worker activated, old caches cleared");
// });

// self.addEventListener("fetch", (event) => {
//   const requestURL = new URL(event.request.url);

//   // Pastikan hanya handle request di bawah /custom_hrms/
//   if (requestURL.pathname.startsWith(BASE_PATH)) {
//     event.respondWith(
//       caches.match(event.request).then((response) => response || fetch(event.request))
//     );
//   }
// });


// Service worker script for Custom HRMS frontend
const CACHE_NAME = "absensi-gembira-v2";
const BASE_PATH = "/custom_hrms/";
const urlsToCache = [
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icons/splash.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  console.log("🪄 Service Worker installed for", BASE_PATH);
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      )
    )
  );
  console.log("🔥 Service Worker activated, old caches cleared");
});

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);

  // Jangan cache API, ambil selalu dari network
  if (requestURL.pathname.includes("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache hanya file statis di BASE_PATH
  if (requestURL.pathname.startsWith(BASE_PATH)) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
  }
});
