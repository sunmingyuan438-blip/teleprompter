// 联网时总取最新版，断网时用上次缓存
const C='tp-v3';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon.svg']))); self.skipWaiting() });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())) });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
