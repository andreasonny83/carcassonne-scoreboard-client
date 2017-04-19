var CACHE_NAME = 'carcassonne-scoreboard-client::v7';
// The files we want to cache
var urlsToCache = [
  '/',
  '/index.html',
  'css/main.min.css',
  'js/angularlibs.js',
  'js/libs.js',
  'js/appcomponents.js',
  'js/mainapp.js',
  'js/templates.js',
  'images/*.*',
  'fonts/carcassonne-scoreboard-font/*.*'
];

// Set the callback for the install step
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});
