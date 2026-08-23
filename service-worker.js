const CACHE_NAME = 'mitu-travel-split-v1-3-4-visible-edit';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.3.1', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.3.2', '米兔分帳小幫手 V1.3.4')
    .replaceAll('米兔分帳小幫手 V1.3.3', '米兔分帳小幫手 V1.3.4')
    .replaceAll('V1.2.6', 'V1.3.4')
    .replaceAll('V1.2.7', 'V1.3.4')
    .replaceAll('V1.2.8', 'V1.3.4')
    .replaceAll('V1.2.9', 'V1.3.4')
    .replaceAll('V1.3.1', 'V1.3.4')
    .replaceAll('V1.3.2', 'V1.3.4')
    .replaceAll('V1.3.3', 'V1.3.4');

  const injector = `<script id="mitu-v134-visible-edit">
(function(){
  const KEY='mituTravelSplit.v1_1';
  const $=id=>document.getElementById(id);
  const today=()=>new Date().toISOString().slice(0,10);
  let editingExpenseId=null, editingPoolId=null, editingLinkId=null, customMode=false;
  function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&Array.isArray(s.trips))return s;}catch(e){}return null;}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function trip(s){if(!s||!s.trips||!s.trips.length)return null;return s.trips.find(t=>t.id===s.currentTripId)||s.trips[0];}
  function sortDesc(a,b){return (b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||'');}
  function name(t,id){return (t.people||[]).find(p=>p.id===id)?.name||'已刪除旅伴';}
  function money(n){return Number(n||0).toLocaleString('zh-TW');}
  function id(){return crypto&&crypto.randomUUID?crypto.randomUUID():'id-'+Date.now()+'-'+Math.random().toString(16).slice(2);}
  function toast(msg){const t=$('toast');if(t){t.textContent=msg;t.classList.add('show');clearTimeout(window.__mituToast);window.__mituToast=setTimeout(()=>t.classList.remove('show'),2200)}else alert(msg)}
  function setVal(id,v){const el=$(id);if(el)el.value=v==null?'':v;}
  function switchTab(tab){document.querySelector('.tab-btn[data-tab="'+tab+'"]')?.click();}
  function checkedSharers(){return Array.from(document.querySelectorAll('#sharerList input:checked')).map(i=>i.value);}
  function payerType(){return $('payerPoolMode')?.classList.contains('active')?'pool':'person';}
  function urlOK(u){return !u||/^https?:\/\//i.test(u);}
  function ensureBanner(){
    const save=$('saveExpenseBtn');
    if(save&&!$('mituEditBanner')){const b=document.createElement('div');b.id='mituEditBanner';b.className='note';b.style.cssText='display:none;margin-top:10px';b.textContent='正在編輯既有支出。修改後按「更新這一筆」。';save.closest('.grid')?.before(b);const c=document.createElement('button');c.id='mituCancelEdit';c.type='button';c.className='btn secondary full';c.textContent='取消編輯';c.style.display='none';c.onclick=()=>{editingExpenseId=null;setExpenseMode(false);$('resetExpenseFormBtn')?.click()};save.closest('.grid')?.appendChild(c)}
    const ps=$('savePoolBtn');
    if(ps&&!$('mituPoolBanner')){const b=document.createElement('div');b.id='mituPoolBanner';b.className='note';b.style.cssText='display:none;margin-top:10px';b.textContent='正在編輯現金池紀錄。';ps.closest('.grid')?.before(b);const c=document.createElement('button');c.id='mituCancelPool';c.type='button';c.className='btn secondary full';c.textContent='取消編輯';c.style.display='none';c.onclick=()=>{editingPoolId=null;setPoolMode(false)};ps.closest('.grid')?.appendChild(c)}
    const ls=$('saveLinkBtn');
    if(ls&&!$('mituLinkBanner')){const b=document.createElement('div');b.id='mituLinkBanner';b.className='note';b.style.cssText='display:none;margin-top:10px';b.textContent='正在編輯雲端連結。';ls.closest('.grid')?.before(b);const c=document.createElement('button');c.id='mituCancelLink';c.type='button';c.className='btn secondary full';c.textContent='取消編輯';c.style.display='none';c.onclick=()=>{editingLinkId=null;setLinkMode(false)};ls.closest('.grid')?.appendChild(c)}
  }
  function setExpenseMode(on){ensureBanner();if($('saveExpenseBtn'))$('saveExpenseBtn').textContent=on?'更新這一筆':'儲存這一筆';if($('mituEditBanner'))$('mituEditBanner').style.display=on?'block':'none';if($('mituCancelEdit'))$('mituCancelEdit').style.display=on?'block':'none'}
  function setPoolMode(on){ensureBanner();if($('savePoolBtn'))$('savePoolBtn').textContent=on?'更新現金池':'加入現金池';if($('mituPoolBanner'))$('mituPoolBanner').style.display=on?'block':'none';if($('mituCancelPool'))$('mituCancelPool').style.display=on?'block':'none'}
  function setLinkMode(on){ensureBanner();if($('saveLinkBtn'))$('saveLinkBtn').textContent=on?'更新連結':'儲存連結';if($('mituLinkBanner'))$('mituLinkBanner').style.display=on?'block':'none';if($('mituCancelLink'))$('mituCancelLink').style.display=on?'block':'none'}
  function addButton(row,cls,text,fn){if(!row||row.querySelector('.'+cls))return;const b=document.createElement('button');b.type='button';b.className='btn secondary small '+cls;b.textContent=text;b.onclick=fn;row.insertBefore(b,row.firstChild)}
  function addButtons(){
    const s=load(),t=trip(s);if(!t)return;ensureBanner();
    const exs=[...(t.expenses||[])].sort(sortDesc);
    Array.from(document.querySelectorAll('#expensesList>.item')).forEach((node,i)=>{const del=Array.from(node.querySelectorAll('button')).find(b=>b.textContent.includes('刪除這筆'));if(!del)return;const row=del.closest('.row')||del.parentElement;const ex=exs[i];if(ex)addButton(row,'mitu-edit-exp','編輯',()=>beginExpense(ex.id));});
    const pools=[...(t.poolContributions||[])].sort(sortDesc);
    Array.from(document.querySelectorAll('#poolList>.item')).forEach((node,i)=>{const del=Array.from(node.querySelectorAll('button')).find(b=>b.textContent.includes('刪除'));if(!del)return;const row=del.closest('.item-top')||del.parentElement;const rec=pools[i];if(rec)addButton(row,'mitu-edit-pool','編輯',()=>beginPool(rec.id));});
    const search=[...(t.expenses||[])].sort(sortDesc);
    Array.from(document.querySelectorAll('#searchResult>.item')).forEach((node,i)=>{if(node.querySelector('.mitu-edit-exp'))return;const title=node.querySelector('.item-title')?.textContent||'';const ex=search.find(e=>(e.title||'未命名項目')===title);if(!ex)return;let row=node.querySelector('.row');if(!row){row=document.createElement('div');row.className='row wrap';node.appendChild(row)}addButton(row,'mitu-edit-exp','編輯',()=>beginExpense(ex.id));});
  }
  function beginExpense(eid){const s=load(),t=trip(s),ex=(t?.expenses||[]).find(e=>e.id===eid);if(!ex)return toast('找不到這筆支出');editingExpenseId=eid;switchTab('expense');setTimeout(()=>{setVal('expenseDate',ex.date||today());setVal('expenseTitle',ex.title||'');setVal('expenseAmount',ex.amount||'');setVal('expenseCurrency',ex.currency||'TWD');setVal('expenseCategory',ex.category||'其他');setVal('expenseReceiptUrl',ex.receiptUrl||'');setVal('expenseNote',ex.note||'');(ex.payerType==='pool'?$('payerPoolMode'):$('payerPersonMode'))?.click();setTimeout(()=>{setVal('expensePayer',ex.payerId||'');document.querySelectorAll('#sharerList input').forEach(i=>{i.checked=(ex.sharerIds||[]).includes(i.value);i.parentElement?.classList.toggle('active',i.checked)});setExpenseMode(true);window.scrollTo({top:0,behavior:'smooth'});},100)},100)}
  function updateExpense(){const s=load(),t=trip(s),ex=(t?.expenses||[]).find(e=>e.id===editingExpenseId);if(!ex)return toast('找不到這筆支出');const title=($('expenseTitle')?.value||'').trim(),amount=Number($('expenseAmount')?.value)||0,receipt=($('expenseReceiptUrl')?.value||'').trim(),sharers=checkedSharers();if(!title)return toast('請輸入項目名稱');if(!amount||amount<=0)return toast('請輸入正確金額');if(!sharers.length)return toast('至少選一位分攤者');if(!urlOK(receipt))return toast('連結請用 http 或 https 開頭');ex.date=$('expenseDate')?.value||today();ex.title=title;ex.amount=amount;ex.currency=$('expenseCurrency')?.value||'TWD';ex.category=$('expenseCategory')?.value||'其他';ex.payerType=payerType();ex.payerId=ex.payerType==='person'?($('expensePayer')?.value||''):'';ex.sharerIds=sharers;ex.receiptUrl=receipt;ex.note=($('expenseNote')?.value||'').trim();save(s);toast('已更新支出');setTimeout(()=>location.reload(),500)}
  function beginPool(pid){const s=load(),t=trip(s),r=(t?.poolContributions||[]).find(x=>x.id===pid);if(!r)return toast('找不到這筆現金池紀錄');editingPoolId=pid;switchTab('pool');setTimeout(()=>{setVal('poolDate',r.date||today());setVal('poolPerson',r.personId||'');setVal('poolAmount',r.amount||'');setVal('poolCurrency',r.currency||'TWD');setVal('poolNote',r.note||'');setPoolMode(true);window.scrollTo({top:0,behavior:'smooth'});},100)}
  function updatePool(){const s=load(),t=trip(s),r=(t?.poolContributions||[]).find(x=>x.id===editingPoolId);if(!r)return toast('找不到這筆現金池紀錄');const amount=Number($('poolAmount')?.value)||0,person=$('poolPerson')?.value||'';if(!person)return toast('請選旅伴');if(!amount||amount<=0)return toast('請輸入正確金額');r.date=$('poolDate')?.value||today();r.personId=person;r.amount=amount;r.currency=$('poolCurrency')?.value||'TWD';r.note=($('poolNote')?.value||'').trim();save(s);toast('已更新現金池');setTimeout(()=>location.reload(),500)}
  function updateLink(){return false}
  function addDownloadNotice(){function show(kind){const s=load(),t=trip(s),name=kind==='all'?'米兔分帳全部行程_'+today()+'.json':'米兔分帳_'+((t&&t.name)||'目前行程')+'_'+today()+'.json';let box=$('downloadNotice');if(!box){box=document.createElement('div');box.id='downloadNotice';box.className='note';box.style.marginTop='10px';$('exportTripBtn')?.parentElement?.after(box)}if(box)box.innerHTML='<strong>已送出下載：</strong>'+name+'<br>Android 通常可在「檔案／Files → Download／下載」找到；也可到「Chrome → ⋮ → 下載內容」查看。<br><span class="hint">提醒：瀏覽器基於隱私限制，不會把完整實際路徑交給 PWA。</span>'} $('exportAllBtn')?.addEventListener('click',()=>setTimeout(()=>show('all'),80),true);$('exportTripBtn')?.addEventListener('click',()=>setTimeout(()=>show('trip'),80),true)}
  function addLedger(){if($('topLedgerShortcutBtn'))return;const bar=document.querySelector('.tripbar');if(!bar)return;const b=document.createElement('button');b.id='topLedgerShortcutBtn';b.type='button';b.className='btn full';b.textContent='📒 查看個人帳簿';b.onclick=()=>switchTab('ledger');bar.appendChild(b)}
  function bind(){const se=$('saveExpenseBtn');if(se&&!se.dataset.mituEdit){se.dataset.mituEdit='1';se.addEventListener('click',e=>{if(!editingExpenseId)return;e.preventDefault();e.stopImmediatePropagation();updateExpense()},true)}const sp=$('savePoolBtn');if(sp&&!sp.dataset.mituEdit){sp.dataset.mituEdit='1';sp.addEventListener('click',e=>{if(!editingPoolId)return;e.preventDefault();e.stopImmediatePropagation();updatePool()},true)}addDownloadNotice()}
  function run(){addLedger();ensureBanner();bind();addButtons()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  setInterval(run,600);
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
})();
</script>`;
  if (!out.includes('mitu-v134-visible-edit')) out = out.replace('</body>', injector + '</body>');
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
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>undefined)));
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