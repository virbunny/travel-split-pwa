const CACHE_NAME = 'mitu-travel-split-v1-3-5-quick-edit-panel';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.3.1', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.3.2', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.3.3', '米兔分帳小幫手 V1.3.5')
    .replaceAll('米兔分帳小幫手 V1.3.4', '米兔分帳小幫手 V1.3.5')
    .replaceAll('V1.2.6', 'V1.3.5')
    .replaceAll('V1.2.7', 'V1.3.5')
    .replaceAll('V1.2.8', 'V1.3.5')
    .replaceAll('V1.2.9', 'V1.3.5')
    .replaceAll('V1.3.1', 'V1.3.5')
    .replaceAll('V1.3.2', 'V1.3.5')
    .replaceAll('V1.3.3', 'V1.3.5')
    .replaceAll('V1.3.4', 'V1.3.5');

  if (!out.includes('mituQuickEditPanel')) {
    const panel = '<div id="mituQuickEditPanel" class="note" style="margin-bottom:12px"><strong>快速編輯支出</strong><br><span class="hint">這是修正版入口：先從下拉選單選一筆，再修改後按「更新這筆支出」。</span><div style="height:8px"></div><select id="mituEditExpenseSelect"><option value="">選擇要編輯的支出</option></select><div class="grid two" style="margin-top:8px"><label>日期<input id="mituEditDate" type="date"></label><label>項目<input id="mituEditTitle" type="text"></label><label>金額<input id="mituEditAmount" type="number" step="0.01"></label><label>幣別<select id="mituEditCurrency"><option value="TWD">台幣 TWD</option><option value="JPY">日圓 JPY</option><option value="KRW">韓幣 KRW</option><option value="USD">美金 USD</option></select></label><label>分類<select id="mituEditCategory"><option>餐食</option><option>交通</option><option>住宿</option><option>門票</option><option>購物</option><option>其他</option></select></label><label>備註<input id="mituEditNote" type="text"></label></div><button id="mituUpdateExpenseBtn" type="button" class="btn full" style="margin-top:8px">更新這筆支出</button></div>';
    out = out.replace('<div class="card"><h2>費用列表</h2><div id="expensesList" class="list"></div></div>', '<div class="card"><h2>費用列表</h2>' + panel + '<div id="expensesList" class="list"></div></div>');
  }

  const script = `<script id="mitu-v135-quick-edit-script">
(function(){
  var KEY='mituTravelSplit.v1_1';
  function $(id){return document.getElementById(id)}
  function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
  function trip(s){if(!s||!s.trips||!s.trips.length)return null;return s.trips.find(function(t){return t.id===s.currentTripId})||s.trips[0]}
  function sorted(t){return (t&&t.expenses?Array.from(t.expenses):[]).sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''))||String(b.createdAt||'').localeCompare(String(a.createdAt||''))})}
  function fillOptions(){var sel=$('mituEditExpenseSelect'); if(!sel)return; var s=load(),t=trip(s),list=sorted(t); var keep=sel.value; sel.innerHTML='<option value="">選擇要編輯的支出</option>'; list.forEach(function(e){var o=document.createElement('option');o.value=e.id;o.textContent=(e.date||'')+'｜'+(e.title||'未命名')+'｜'+(e.currency||'')+' '+Number(e.amount||0).toLocaleString('zh-TW');sel.appendChild(o)}); if(keep)sel.value=keep}
  function current(){var s=load(),t=trip(s),sel=$('mituEditExpenseSelect'); if(!t||!sel)return null; return {s:s,t:t,e:(t.expenses||[]).find(function(x){return x.id===sel.value})}}
  function loadOne(){var c=current(); if(!c||!c.e)return; $('mituEditDate').value=c.e.date||''; $('mituEditTitle').value=c.e.title||''; $('mituEditAmount').value=c.e.amount||''; $('mituEditCurrency').value=c.e.currency||'TWD'; $('mituEditCategory').value=c.e.category||'其他'; $('mituEditNote').value=c.e.note||''}
  function updateOne(){var c=current(); if(!c||!c.e){alert('請先選擇一筆支出');return} var title=($('mituEditTitle').value||'').trim(); var amount=Number($('mituEditAmount').value); if(!title){alert('請輸入項目');return} if(!amount||amount<=0){alert('請輸入正確金額');return} c.e.date=$('mituEditDate').value||c.e.date; c.e.title=title; c.e.amount=amount; c.e.currency=$('mituEditCurrency').value||c.e.currency; c.e.category=$('mituEditCategory').value||c.e.category; c.e.note=($('mituEditNote').value||'').trim(); save(c.s); alert('已更新這筆支出'); location.reload()}
  function addButtonNearDelete(){var s=load(),t=trip(s),list=sorted(t); var cards=document.querySelectorAll('#expensesList .item'); cards.forEach(function(card,i){if(card.querySelector('[data-v135-edit]'))return; var ex=list[i]; if(!ex)return; var row=card.querySelector('.row')||card; var b=document.createElement('button'); b.type='button'; b.className='btn secondary small'; b.textContent='編輯'; b.dataset.v135Edit=ex.id; b.onclick=function(){var sel=$('mituEditExpenseSelect'); if(sel){sel.value=ex.id; loadOne(); var panel=$('mituQuickEditPanel'); if(panel)panel.scrollIntoView({behavior:'smooth',block:'center'});}}; row.insertBefore(b,row.firstChild)});}
  function init(){fillOptions(); var sel=$('mituEditExpenseSelect'); if(sel&&!sel.dataset.bound){sel.dataset.bound='1';sel.addEventListener('change',loadOne)} var up=$('mituUpdateExpenseBtn'); if(up&&!up.dataset.bound){up.dataset.bound='1';up.addEventListener('click',updateOne)} addButtonNearDelete()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init(); setTimeout(init,500); setInterval(init,1000);
})();
</script>`;
  if(!out.includes('mitu-v135-quick-edit-script')) out = out.replace('</body>', script + '</body>');
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

self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>undefined))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener('fetch', event => { if (event.request.method !== 'GET') return; const url = new URL(event.request.url); const isIndex = event.request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'); if (isIndex) { event.respondWith(indexResponse(event.request)); return; } event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))); });