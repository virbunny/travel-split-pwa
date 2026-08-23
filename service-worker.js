const CACHE_NAME = 'mitu-travel-split-v1-3-1-export-location-notice';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.1')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.1')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.1')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.1')
    .replaceAll('V1.2.6', 'V1.3.1')
    .replaceAll('V1.2.7', 'V1.3.1')
    .replaceAll('V1.2.8', 'V1.3.1')
    .replaceAll('V1.2.9', 'V1.3.1');

  const injector = `<script id="mitu-v131-export-location-notice">
(function(){
  function showExportNotice(filename){
    var msg = '已送出下載：' + (filename || 'JSON 備份檔') + '\n\nAndroid 通常可在「檔案／Files → Download／下載」找到；也可到「Chrome → ⋮ → 下載內容」查看。\n\n提醒：瀏覽器基於隱私限制，不會把完整實際路徑交給 PWA。';
    var box = document.getElementById('jsonExportNoticeBox');
    if(!box){
      box = document.createElement('div');
      box.id = 'jsonExportNoticeBox';
      box.className = 'note';
      box.style.cssText = 'white-space:pre-line;margin-top:12px;border-left:5px solid #4f89a3;background:#e8f6fb;color:#35401d;font-weight:800';
      var dataPage = document.getElementById('page-data');
      var target = document.querySelector('#exportAllBtn, #exportTripBtn, [id*="export"]');
      var parent = target ? target.closest('.card') : null;
      if(parent) parent.appendChild(box);
      else if(dataPage) dataPage.insertBefore(box, dataPage.firstChild);
      else document.body.appendChild(box);
    }
    box.textContent = msg;
    if(window.toast) { try{ window.toast('JSON 已送出下載，請看下載資料夾'); }catch(e){} }
    else alert(msg);
  }

  function patchDownloadClick(){
    if(HTMLAnchorElement.prototype._mituJsonNoticePatched) return;
    var oldClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function(){
      var name = this.getAttribute('download') || '';
      var href = this.getAttribute('href') || '';
      var isJson = /\.json$/i.test(name) || (name && name.indexOf('分帳') >= 0) || href.indexOf('blob:') === 0;
      var result = oldClick.apply(this, arguments);
      if(isJson){ setTimeout(function(){ showExportNotice(name || '米兔分帳備份.json'); }, 120); }
      return result;
    };
    HTMLAnchorElement.prototype._mituJsonNoticePatched = true;
  }

  function addExportHint(){
    var dataPage = document.getElementById('page-data');
    if(!dataPage || document.getElementById('jsonExportHint')) return;
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'jsonExportHint';
    card.innerHTML = '<h2>JSON 匯出位置</h2><div class="note">匯出 JSON 後，檔案通常會進入 Android 的「檔案／Files → Download／下載」。Chrome 也可從右上角 ⋮ → 下載內容查看。因瀏覽器隱私限制，PWA 只能提示常見位置，不能讀取完整實際路徑。</div>';
    var first = dataPage.querySelector('.card');
    if(first && first.nextSibling) dataPage.insertBefore(card, first.nextSibling);
    else dataPage.appendChild(card);
  }

  function addUpdateLog(){
    var page = document.getElementById('page-data');
    if(!page) return;
    var existing = document.getElementById('updateLogCard') || document.getElementById('v129UpdateLog');
    if(existing){
      if(existing.textContent.indexOf('V1.3.1') < 0){
        var item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = '<div class="item-title">V1.3.1｜JSON 匯出位置提示</div><div class="item-meta">匯出 JSON 後顯示檔名與 Android 常見下載位置提示。</div>';
        var list = existing.querySelector('.list') || existing;
        list.insertBefore(item, list.firstChild);
      }
      return;
    }
    var card = document.createElement('div');
    card.className = 'card';
    card.id = 'updateLogCard';
    card.innerHTML = '<h2>更新記錄</h2><div class="list">'
      + '<div class="item"><div class="item-title">V1.3.1｜JSON 匯出位置提示</div><div class="item-meta">匯出 JSON 後顯示檔名與 Android 常見下載位置提示。</div></div>'
      + '<div class="item"><div class="item-title">V1.3.0｜既有紀錄可編輯</div><div class="item-meta">支出、現金池與雲端連結可編輯既有紀錄。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.9｜自訂分攤金額</div><div class="item-meta">新增自訂分攤金額，適合點餐各吃各的。</div></div>'
      + '<div class="item"><div class="item-title">V1.2.8｜首頁帳簿捷徑與更新記錄</div><div class="item-meta">帳簿捷徑移到首頁上方，新增更新記錄。</div></div>'
      + '</div>';
    page.appendChild(card);
  }

  function run(){ patchDownloadClick(); addExportHint(); addUpdateLog(); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
</script>`;
  if(!out.includes('mitu-v131-export-location-notice')) out = out.replace('</body>', injector + '</body>');
  return out;
}

async function indexResponse(request) {
  let response;
  try { response = await fetch(request, { cache: 'no-store' }); }
  catch (err) { response = await caches.match('./index.html') || await caches.match(request); }
  if (!response) return fetch(request);
  const text = await response.clone().text();
  return new Response(upgradeIndex(text), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isIndex = event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (isIndex) { event.respondWith(indexResponse(event.request)); return; }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});