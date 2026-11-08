const CACHE_NAME='nasho-validation-shell-v1';
const APP_SHELL=['/','/index.html','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request; const url=new URL(req.url);
  if(req.method!=='GET' || url.origin!==self.location.origin) return;
  if(url.pathname.startsWith('/api') || url.pathname.includes('script.google.com')) return;
  event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}return response;}).catch(()=>caches.match(req).then(hit=>hit||caches.match('/index.html'))));
});
