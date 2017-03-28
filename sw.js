var zAppVersion = 'cc2017-3-28'
, gs = 'https://stewved.github.io/globalscripts/';
self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(zAppVersion).then(function(cache) {
    return cache.addAll([
        './'
      , './appmanifest'
      , './events.js'
      , './fileList.js'
      , './main.js'
      , './texts.js'
    /*
      Do not include:
      index.html
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
        return caches.open(zAppVersion).then(function(cache) {
          console.log(event.request.url + ' not found in cache!');
          cache.put(event.request, netResponse.clone());
          console.log(event.request.url + ' added to cache!');
          return netResponse;
        });
      });
    })
  );
});
self.addEventListener('activate', function(event) {
  var zAppPrefix = zAppVersion.slice(0, 2);
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName.slice(0, 2) === zAppPrefix) {
        if (cacheName !== zAppVersion) {
          return caches.delete(cacheName);
        }
      }
    }))
  }))
});
