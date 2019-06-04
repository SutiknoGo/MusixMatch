var CACHE_STATIC_NAME = 'musixmatch-static';
var CACHE_DYNAMIC_NAME = 'musixmatch-dynamic';

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function (cache) {
      console.log('[Service Worker] Precaching App Shell');
      cache.addAll([
        '/index.html',
        '/css/animate.css',
        '/css/bootstrap-responsive.css',
        '/css/bootstrap-responsive.min.css',
        '/css/bootstrap.css',
        '/css/flexsilder.css',
        '/css/font-awesome-ie7.css',
        '/css/font-awesome.css',
        '/css/main.css',
        '/css/overwrite.css',
        '/css/prettyPhoto.css',
        '/css/style.css',

        '/js/jquery.js',
        '/js/jquery.scrollTo.js',
        '/js/jquery.nav.js',
        '/js/jquery.localScroll.js',
        '/js/bootstrap.js',
        '/js/jquery.prettyPhoto.js',
        '/js/isotope.js',
        '/js/jquery.flexslider.js',
        '/js/inview.js',
        '/js/animate.js',
        '/js/custom.js',

        // modify
        '/js/artist_album_track_lyric.js',
        '/js/artist_album_track.js',
        '/js/artist_album.js',
        '/js/artist_track_lyric.js',
        '/js/artist_track.js',
        '/js/artist.js',
        '/js/detail_track.js',
        '/js/genre.js',
        '/js/main.js',
        '/js/track.js',
      ]);
    })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (res) {
            return caches.open(CACHE_DYNAMIC_NAME)
              .then(function (cache) {
                cache.put(event.request.url, res.clone());
                return res;
              })
          })
          .catch(function (err) {

          });
      }
    })
  );
});