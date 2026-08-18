const CACHE_NAME = 'mitu-travel-split-v1-2-8-home-ledger-log';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.2.8')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.2.8')
    .replaceAll('V1.2.6', 'V1.2.8')
    .replaceAll('V1.2.7', 'V1.2.8')
    .replaceAll("version:'1.2.6'", "version:'1.2.8'")
    .replaceAll("version:'1.2.7'", "version:'1.2.8'")
    .replaceAll('version:"1.2.6"', 'version:"1.2.8"')
    .replaceAll('version:"1.2.7"', 'version:"1.2.8"');

  const injector = `<script id="mitu-v128-home-ledger-and-update-log">
(function(){
  function jumpToLedger(){
    var tab = document.querySelector('.tab-btn[data-tab="ledger"]');
    if(tab) tab.click();
  }
  function makeBtn(){
    var btn = document.createElement('button');
    btn.id = 'topLedgerShortcutBtn';
    btn.type = 'button';
    btn.className = 'btn full';
    btn.textContent = '📒 查看個人帳簿';
    btn.setAttribute('data-jump','ledger');
    btn.addEventListener('click', jumpToLedger);
    return btn;
  }
  function addTopLedgerShortcut(){
    if(document.getElementById('topLedgerShortcutBtn')) return;
    var tripbar = document.querySelector('.tripbar');
    if(!tripbar) return;
    tripbar.appendChild(makeBtn());
  }
  function addMiddleLedgerShortcut(){
    if(document.getElementById('homeLedgerShortcutBtn')) return;
    var tripsPage = document.getElementById('page-trips');
    if(!tripsPage) return;
    var setting = tripsPage.querySelector('#tripNameEdit');
    if(!setting) return;
    var card = setting.closest('.card');
    if(!card) return;
    var wrap = document.createElement('div');
    wrap.className = 'grid three no-print';
    wrap.style.marginTop = '10px';
    var b1 = document.createElement('button');
    b1.className = 'btn full';
    b1.textContent = '＋ 記一筆支出';
    b1.addEventListener('click', function(){ var tab=document.querySelector('.tab-btn[data-tab="expense"]'); if(tab) tab.click(); });
    var b2 = makeBtn();
    b2.id = 'homeLedgerShortcutBtn';
    var b3 = document.createElement('button');
    b3.className = 'btn secondary full';
    b3.textContent = '看結算';
    b3.addEventListener('click', function(){ var tab=document.querySelector('.tab-btn[data-tab="settlement"]'); if(tab) tab.click(); });
    wrap.appendChild(b1); wrap.appendChild(b2); wrap.appendChild(b3);
    card.appendChild(wrap);
  }
  function addUpdateLog(){
    if(document.getElementById('updateLogCard')) return;
    var page = document.getElementById('page-data');
    if(!page) return;
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'updateLogCard';
    card.innerHTML = '<h2>更新記錄</h2><div class="list">'
      + '<div class="item"><div class="item-title">V1.2.8｜首頁帳簿捷徑移到最上方</div><div class="item-meta">在「目前行程」下方直接新增「📒 查看個人帳簿」按鈕，並新增本更新記錄。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.7｜首頁帳簿捷徑</div><div class="item-meta">在首頁「目前行程設定」加入帳簿捷徑。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.6｜個人帳簿總覽</div><div class="item-meta">新增「帳簿」分頁，可依旅伴與幣別查看個人支出、分攤與明細。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.5｜行程名稱可編輯</div><div class="item-meta">行程列表可直接修改行程標題，不需刪除重建。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.4｜綠藍配色</div><div class="item-meta">移除粉紅點綴，改成淺綠主色＋粉藍輔色。</div></div>'
      + '</div>';
    var first = page.querySelector('.card');
    if(first && first.nextSibling) page.insertBefore(card, first.nextSibling);
    else page.appendChild(card);
  }
  function run(){ addTopLedgerShortcut(); addMiddleLedgerShortcut(); addUpdateLog(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
</script>`;
  if(!out.includes('mitu-v128-home-ledger-and-update-log')) {
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