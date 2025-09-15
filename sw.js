const CACHE = 'confirmacitas-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // agrega ./icon-192.png, ./icon-512.png si los subes
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request).then(r=>{
        const clone = r.clone();
        caches.open(CACHE).then(c=> c.put(e.request, clone)).catch(()=>{});
        return r;
      }).catch(()=> res || new Response('Offline', {status:503}));
    })
  );
});
