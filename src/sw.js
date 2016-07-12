var CACHE_NAME = 'carcassonne-scoreboard-client::v5';
// The files we want to cache
var urlsToCache = [
  '/',
  '/index.html',
  'css/main.min.css',
  'js/angularlibs.js',
  'js/libs.js',
  'js/appcomponents.js',
  'js/config.js',
  'js/mainapp.js',
  'js/templates.js',
  'fonts/carcassonne-scoreboard-font/carcassonne-scoreboard-font.eot',
  'fonts/carcassonne-scoreboard-font/carcassonne-scoreboard-font.ttf',
  'fonts/carcassonne-scoreboard-font/carcassonne-scoreboard-font.woff',
  'fonts/carcassonne-scoreboard-font/carcassonne-scoreboard-font.woff2',
  'fonts/carcassonne-scoreboard-font/carcassonne-scoreboard-font.svg'
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
