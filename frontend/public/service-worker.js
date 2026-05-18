

// // Service worker script for Custom HRMS frontend
// const CACHE_NAME = "absensi-gembira-v2";
// const BASE_PATH = "/custom_hrms/";
// const urlsToCache = [
//   `${BASE_PATH}index.html`,
//   `${BASE_PATH}manifest.json`,
//   `${BASE_PATH}icons/splash.png`,
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
//   );
//   console.log("🪄 Service Worker installed for", BASE_PATH);
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then(cacheNames =>
//       Promise.all(
//         cacheNames.filter(name => name !== CACHE_NAME)
//                   .map(name => caches.delete(name))
//       )
//     )
//   );
//   console.log("🔥 Service Worker activated, old caches cleared");
// });

// self.addEventListener("fetch", (event) => {
//   const requestURL = new URL(event.request.url);

//   // Jangan cache API, ambil selalu dari network
//   if (requestURL.pathname.includes("/api/")) {
//     event.respondWith(fetch(event.request));
//     return;
//   }

//   // Cache hanya file statis di BASE_PATH
//   if (requestURL.pathname.startsWith(BASE_PATH)) {
//     event.respondWith(
//       caches.match(event.request)
//         .then(cached => cached || fetch(event.request))
//     );
//   }
// });


const CACHE_NAME = "absensi-gembira-v1-5";

const BASE_PATH = "/custom_hrms/";

const urlsToCache = [
  `${BASE_PATH}`,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}icons/splash.png`,
];



// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", (event) => {

  console.log("🪄 Service Worker Installing...");

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))

  );

});



// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", (event) => {

  console.log("🔥 Service Worker Activated");

  event.waitUntil(

    caches.keys().then(cacheNames =>

      Promise.all(

        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))

      )

    )

  );

  self.clients.claim();

});



// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", (event) => {

  const requestURL = new URL(event.request.url);



  // =====================================================
  // API → ALWAYS NETWORK
  // =====================================================

  if (requestURL.pathname.includes("/api/")) {

    event.respondWith(fetch(event.request));

    return;

  }



  // =====================================================
  // HTML / SPA ROUTES → NETWORK FIRST
  // =====================================================

  if (
    requestURL.pathname.startsWith(BASE_PATH)
  ) {

    event.respondWith(

      fetch(event.request)

        .then((networkResponse) => {

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });

          return networkResponse;

        })

        .catch(() => {

          return caches.match(event.request);

        })

    );

  }

});