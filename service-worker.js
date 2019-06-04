const STATIC_ASSETS = [
    './index.html',
    './css/animate.css',
    './css/bootstrap-responsive.css',
    './css/bootstrap-responsive.min.css',
    './css/bootstrap.css',
    './css/flexsilder.css',
    './css/font-awesome-ie7.css',
    './css/font-awesome.css',
    './css/main.css',
    './css/overwrite.css',
    './css/prettyPhoto.css',
    './css/style.css',

    './js/jquery.js',
    './js/jquery.scrollTo.js',
    './js/jquery.nav.js',
    './js/jquery.localScroll.js',
    './js/bootstrap.js',
    './js/jquery.prettyPhoto.js',
    './js/isotope.js',
    './js/jquery.flexslider.js',
    './js/inview.js',
    './js/animate.js',
    './js/custom.js',

    // modify
    './js/artist_album_track_lyric.js',
    './js/artist_album_track.js',
    './js/artist_album.js',
    './js/artist_track_lyric.js',
    './js/artist_track.js',
    './js/artist.js',
    './js/detail_track.js',
    './js/genre.js',
    './js/main.js',
    './js/track.js',

];


const STATIC_CACHE_NAME = 'musixmatch-static';
const DYNAMIC_CACHE_NAME = 'musixmatch-dynamic';

self.addEventListener('install', async evt => {
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.addAll(STATIC_ASSETS);
});

self.addEventListener('fetch', evt => {
    const req = evt.request;
    const url = new URL(req.url);

    if (url.origin == location.origin) {
        evt.respondWith(cacheFirst(req));
    } else {
        evt.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    try {
        // try go to network and fetch data 
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        // look something on cache. 
        return await cache.match(req);
    }
}

self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== STATIC_CACHE_NAME) {
                    console.log('[ServiceWorker] removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});