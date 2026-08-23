const CACHE_NAME = 'mitu-travel-split-v1-3-6-edit-click-fix';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.3.1', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.3.2', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.3.3', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.3.4', '米兔分帳小幫手 V1.3.6')
    .replaceAll('米兔分帳小幫手 V1.3.5', '米兔分帳小幫手 V1.3.6')
    .replaceAll('V1.2.6', 'V1.3.6')
    .replaceAll('V1.2.7', 'V1.3.6')
    .replaceAll('V1.2.8', 'V1.3.6')
    .replaceAll('V1.2.9', 'V1.3.6')
    .replaceAll('V1.3.1', 'V1.3.6')
    .replaceAll('V1.3.2', 'V1.3.6')
    .replaceAll('V1.3.3', 'V1.3.6')
    .replaceAll('V1.3.4', 'V1.3.6')
    .replaceAll('V1.3.5', 'V1.3.6');

  const injector = `<script id="mitu-v136-edit-click-fix">
(function(){
  const KEY='mituTravelSplit.v1_1';
  const $=id=>document.getElementById(id);
  function load(){try{const s=JSON.parse(localStorage.getItem(KEY)); if(s&&Array.isArray(s.trips)) return s;}catch(e){} return null;}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function activeTrip(s){if(!s||!s.trips||!s.trips.length)return null; return s.trips.find(t=>t.id===s.currentTripId)||s.trips[0];}
  function sortDesc(a,b){return (b.date||'').localeCompare(a.date||'') || (b.createdAt||'').localeCompare(a.createdAt||'');}
  function personName(t,id){return (t.people||[]).find(p=>p.id===id)?.name||'已刪除旅伴';}
  function money(n){return Number(n||0).toLocaleString('zh-TW');}
  function toast(msg){const t=$('toast'); if(t){t.textContent=msg;t.classList.add('show');clearTimeout(window.__mituToast);window.__mituToast=setTimeout(()=>t.classList.remove('show'),2200);} else alert(msg);}
  function switchTab(tab){document.querySelector('.tab-btn[data-tab="'+tab+'"]')?.click();}
  function currentSearchItems(t){const k=($('searchKeyword')?.value||'').trim().toLowerCase(); const d=$('searchDate')?.value||''; return [...(t.expenses||[])].filter(e=>{if(d&&e.date!==d)return false; if(!k)return true; const hay=[e.title,e.category,e.note,personName(t,e.payerId),e.payerType==='pool'?'現金池':'',...(e.sharerIds||[]).map(id=>personName(t,id))].join(' ').toLowerCase(); return hay.includes(k);}).sort(sortDesc);}
  function getExpenseForCard(card){
    const s=load(), t=activeTrip(s); if(!t)return null;
    let list=[]; let cards=[];
    if(card.closest('#searchResult')){list=currentSearchItems(t); cards=Array.from(document.querySelectorAll('#searchResult .item'));}
    else {list=[...(t.expenses||[])].sort(sortDesc); cards=Array.from(document.querySelectorAll('#expensesList .item'));}
    const i=cards.indexOf(card);
    if(i>=0 && list[i]) return {state:s,trip:t,expense:list[i]};
    const text=card.textContent||'';
    return {state:s,trip:t,expense:(t.expenses||[]).find(e=>text.includes(e.title||'') && text.includes(String(e.amount||'')))};
  }
  function editExpense(card){
    const data=getExpenseForCard(card); if(!data||!data.expense)return toast('找不到這筆支出');
    const ex=data.expense;
    const oldTitle=ex.title||'';
    const title=prompt('項目名稱', oldTitle); if(title===null)return;
    const amountText=prompt('金額', ex.amount||''); if(amountText===null)return;
    const amount=Number(String(amountText).replace(/,/g,'')); if(!amount||amount<=0)return alert('金額不正確，未更新。');
    const date=prompt('日期，例如 2026-08-23', ex.date||''); if(date===null)return;
    const currency=prompt('幣別：TWD / JPY / KRW / USD', ex.currency||'TWD'); if(currency===null)return;
    const category=prompt('分類', ex.category||'其他'); if(category===null)return;
    const note=prompt('備註', ex.note||''); if(note===null)return;
    if(!confirm('確定更新這筆支出？\n\n'+oldTitle+' → '+title+'\n金額：'+money(ex.amount)+' → '+money(amount)))return;
    ex.title=title.trim()||oldTitle;
    ex.amount=amount;
    ex.date=date.trim()||ex.date;
    ex.currency=(currency.trim()||ex.currency||'TWD').toUpperCase();
    ex.category=category.trim()||'其他';
    ex.note=note.trim();
    save(data.state);
    alert('已更新這筆支出。');
    location.reload();
  }
  function addEditButtons(){
    document.querySelectorAll('#expensesList .item,#searchResult .item').forEach(card=>{
      if(card.querySelector('.mitu-v136-edit'))return;
      const del=Array.from(card.querySelectorAll('button')).find(b=>(b.textContent||'').trim().includes('刪除'));
      const btn=document.createElement('button');
      btn.type='button'; btn.className='btn secondary full mitu-v136-edit'; btn.textContent='編輯';
      if(del) del.parentElement.insertBefore(btn,del); else card.appendChild(btn);
    });
  }
  function addDownloadNotice(){
    function show(name){let box=$('downloadNotice'); if(!box){box=document.createElement('div'); box.id='downloadNotice'; box.className='note'; box.style.marginTop='10px'; $('exportTripBtn')?.parentElement?.after(box);} if(box){box.style.display='block'; box.innerHTML='<strong>已送出下載：</strong>'+name+'<br>Android 通常可在「檔案／Files → Download／下載」找到；也可到「Chrome → ⋮ → 下載內容」查看。<br><span class="hint">提醒：瀏覽器基於隱私限制，不會把完整實際路徑交給 PWA。</span>';}}
    const today=new Date().toISOString().slice(0,10);
    $('exportAllBtn')?.addEventListener('click',()=>setTimeout(()=>show('米兔分帳全部行程_'+today+'.json'),80),true);
    $('exportTripBtn')?.addEventListener('click',()=>{const s=load(),t=activeTrip(s);setTimeout(()=>show('米兔分帳_'+((t&&t.name)||'目前行程')+'_'+today+'.json'),80);},true);
  }
  function addHomeLedger(){if($('topLedgerShortcutBtn'))return; const bar=document.querySelector('.tripbar'); if(!bar)return; const b=document.createElement('button'); b.id='topLedgerShortcutBtn'; b.type='button'; b.className='btn full'; b.textContent='📒 查看個人帳簿'; b.addEventListener('click',()=>switchTab('ledger')); bar.appendChild(b);}
  function addUpdateLog(){const page=$('page-data'); if(!page||$('v136UpdateLog'))return; const card=document.createElement('div'); card.id='v136UpdateLog'; card.className='card'; card.innerHTML='<h2>更新記錄</h2><div class="list"><div class="item"><div class="item-title">V1.3.6｜編輯按鈕修正</div><div class="item-meta">修正按下「編輯」無反應的問題；先用彈出視窗快速修改日期、項目、金額、幣別、分類與備註。</div></div><div class="item"><div class="item-title">V1.3.5｜快速編輯面板</div><div class="item-meta">嘗試新增快速編輯入口。</div></div><div class="item"><div class="item-title">V1.3.1｜JSON 匯出位置提示</div><div class="item-meta">匯出 JSON 後顯示 Android 下載位置提示。</div></div></div>'; page.appendChild(card);}
  document.addEventListener('click',function(e){
    const btn=e.target.closest('button'); if(!btn)return;
    const label=(btn.textContent||'').trim();
    if(label==='編輯' || btn.classList.contains('mitu-v136-edit')){
      const card=btn.closest('.item'); if(!card)return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      editExpense(card);
    }
  },true);
  function run(){addHomeLedger(); addDownloadNotice(); addUpdateLog(); addEditButtons();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
  setInterval(addEditButtons,700);
})();
</script>`;
  if(!out.includes('mitu-v136-edit-click-fix')) out = out.replace('</body>', injector + '</body>');
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