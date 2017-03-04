var zAppCache = 'calorieCalc-2017-3-4';
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(zAppCache).then(function(cache) {
    return cache.addAll([
        './'
      , './appmanifest'
      , './images/Patreon.png'
      , './images/PaypalDonate.png'
      , './images/StewVed.jpg'
      , './initialize.js'
      , './inputs.js'
      , './loader.js'
      , './main.css'
      , './main.js'
      , './settings.js'
      , './sounds.js'
      , './storage.js'
      , './texts.js'
      , './toolTips.js'

    /*
      Do not include:
      index.html
      (chrome 56.0.2924.87 (64-bit) asks for appmanifest now!) Application Manifest file (appmanifest)
      any favicons
      Service Worker file (sw.js)
    */
    ])
  }))
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cacheResponse) {
      return cacheResponse || fetch(event.request).then(function(netResponse) {
        return caches.open(zAppCache).then(function(cache) {
          cache.put(event.request, netResponse.clone());
          console.log(event.request + ' not found in cache!');
          return netResponse;
        });
      });
    })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== zAppCache) {
        return caches.delete(cacheName);
      }
    }))
  }))
});
