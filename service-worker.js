const CACHE_NAME = 'mitu-travel-split-v1-2-7-home-ledger';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon-64.png',
  './icons/apple-touch-icon.png'
];

function upgradeIndex(html) {
  let out = html
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.2.7')
    .replaceAll('V1.2.6', 'V1.2.7')
    .replaceAll("version:'1.2.6'", "version:'1.2.7'")
    .replaceAll('version:"1.2.6"', 'version:"1.2.7"')
    .replaceAll('version:\'1.2.6\'', 'version:\'1.2.7\'');

  const injector = `<script id="mitu-v127-home-ledger-shortcut">
(function(){
  function jumpToLedger(){
    var tab = document.querySelector('.tab-btn[data-tab="ledger"]');
    if(tab) tab.click();
  }
  function addLedgerShortcut(){
    if(document.getElementById('homeLedgerShortcutBtn')) return;
    var tripsPage = document.getElementById('page-trips');
    if(!tripsPage) return;
    var target = tripsPage.querySelector('[data-jump="settlement"], [data-jump="expense"]');
    if(!target) return;
    var wrap = target.closest('.grid') || target.parentElement;
    if(!wrap) return;
    wrap.classList.remove('two');
    wrap.classList.add('three');
    var btn = document.createElement('button');
    btn.id = 'homeLedgerShortcutBtn';
    btn.type = 'button';
    btn.className = 'btn secondary full';
    btn.textContent = '📒 查看個人帳簿';
    btn.setAttribute('data-jump','ledger');
    btn.addEventListener('click', jumpToLedger);
    var settlement = tripsPage.querySelector('[data-jump="settlement"]');
    if(settlement && settlement.parentElement === wrap) wrap.insertBefore(btn, settlement);
    else wrap.appendChild(btn);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLedgerShortcut);
  else addLedgerShortcut();
})();
</script>`;
  if(!out.includes('mitu-v127-home-ledger-shortcut')) {
    out = out.replace('</body>', injector + '</body>');
  }
  return out;
}

async function indexResponse(request) {
  let response;
  try {
    response = await fetch(request, { cache: 'no-store' });
  } catch (err) {
    response = await caches.match('./index.html') || await caches.match(request);
  }
  if (!response) return fetch(request);
  const text = await response.clone().text();
  return new Response(upgradeIndex(text), {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isIndex = event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isIndex) {
    event.respondWith(indexResponse(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});