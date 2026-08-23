const CACHE_NAME = 'mitu-travel-split-v1-3-2-edit-hotfix';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.2')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.2')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.2')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.2')
    .replaceAll('米兔分帳小幫手 V1.3.1', '米兔分帳小幫手 V1.3.2')
    .replaceAll('V1.2.6', 'V1.3.2')
    .replaceAll('V1.2.7', 'V1.3.2')
    .replaceAll('V1.2.8', 'V1.3.2')
    .replaceAll('V1.2.9', 'V1.3.2')
    .replaceAll('V1.3.1', 'V1.3.2');

  const injector = `<script id="mitu-v132-edit-hotfix">
(function(){
  const KEY='mituTravelSplit.v1_1';
  const $=id=>document.getElementById(id);
  const today=()=>new Date().toISOString().slice(0,10);
  let editingExpenseId=null, editingPoolId=null, editingLinkId=null, customMode=false;
  function load(){try{const s=JSON.parse(localStorage.getItem(KEY)); if(s&&Array.isArray(s.trips)) return s;}catch(e){} return null;}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function activeTrip(s){if(!s||!s.trips||!s.trips.length)return null; return s.trips.find(t=>t.id===s.currentTripId)||s.trips[0];}
  function sortDesc(a,b){return (b.date||'').localeCompare(a.date||'') || (b.createdAt||'').localeCompare(a.createdAt||'');}
  function toast(msg){const t=$('toast'); if(t){t.textContent=msg;t.classList.add('show');clearTimeout(window.__mituToast);window.__mituToast=setTimeout(()=>t.classList.remove('show'),2200);} else alert(msg);}
  function validUrl(u){return !u || /^https?:\/\//i.test(u);}
  function money(n){return Number(n||0).toLocaleString('zh-TW');}
  function byId(list,id){return (list||[]).find(x=>x.id===id);}
  function personName(t,id){return (t.people||[]).find(p=>p.id===id)?.name||'已刪除旅伴';}
  function setVal(id,v){const el=$(id); if(el!=null) el.value=v==null?'':v;}
  function checkedSharers(){return Array.from(document.querySelectorAll('#sharerList input:checked')).map(i=>i.value);}
  function currentPayerType(){return $('payerPoolMode')?.classList.contains('active')?'pool':'person';}
  function switchTab(tab){document.querySelector('.tab-btn[data-tab="'+tab+'"]')?.click();}
  function ensureEditUi(){
    if(!$('expenseEditHotfixBanner') && $('saveExpenseBtn')){
      const b=document.createElement('div'); b.id='expenseEditHotfixBanner'; b.className='note'; b.style.display='none'; b.style.marginTop='10px'; b.textContent='正在編輯既有支出，修改後請按「更新這一筆」。'; $('saveExpenseBtn').closest('.grid')?.before(b);
      const c=document.createElement('button'); c.id='cancelExpenseEditHotfix'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingExpenseId=null; setExpenseEditMode(false); $('resetExpenseFormBtn')?.click();}); $('saveExpenseBtn').closest('.grid')?.appendChild(c);
    }
    if(!$('poolEditHotfixBanner') && $('savePoolBtn')){
      const b=document.createElement('div'); b.id='poolEditHotfixBanner'; b.className='note'; b.style.display='none'; b.style.marginTop='10px'; b.textContent='正在編輯現金池紀錄。'; $('savePoolBtn').closest('.grid')?.before(b);
      const c=document.createElement('button'); c.id='cancelPoolEditHotfix'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingPoolId=null; setPoolEditMode(false); $('poolAmount').value=''; $('poolNote').value='';}); $('savePoolBtn').closest('.grid')?.appendChild(c);
    }
    if(!$('linkEditHotfixBanner') && $('saveLinkBtn')){
      const b=document.createElement('div'); b.id='linkEditHotfixBanner'; b.className='note'; b.style.display='none'; b.style.marginTop='10px'; b.textContent='正在編輯雲端連結。'; $('saveLinkBtn').closest('.grid')?.before(b);
      const c=document.createElement('button'); c.id='cancelLinkEditHotfix'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingLinkId=null; setLinkEditMode(false); $('linkTitle').value=''; $('linkUrl').value=''; $('linkNote').value='';}); $('saveLinkBtn').closest('.grid')?.appendChild(c);
    }
  }
  function setExpenseEditMode(on){ensureEditUi(); if($('saveExpenseBtn')) $('saveExpenseBtn').textContent=on?'更新這一筆':'儲存這一筆'; if($('expenseEditHotfixBanner')) $('expenseEditHotfixBanner').style.display=on?'block':'none'; if($('cancelExpenseEditHotfix')) $('cancelExpenseEditHotfix').style.display=on?'block':'none';}
  function setPoolEditMode(on){ensureEditUi(); if($('savePoolBtn')) $('savePoolBtn').textContent=on?'更新現金池':'加入現金池'; if($('poolEditHotfixBanner')) $('poolEditHotfixBanner').style.display=on?'block':'none'; if($('cancelPoolEditHotfix')) $('cancelPoolEditHotfix').style.display=on?'block':'none';}
  function setLinkEditMode(on){ensureEditUi(); if($('saveLinkBtn')) $('saveLinkBtn').textContent=on?'更新連結':'儲存連結'; if($('linkEditHotfixBanner')) $('linkEditHotfixBanner').style.display=on?'block':'none'; if($('cancelLinkEditHotfix')) $('cancelLinkEditHotfix').style.display=on?'block':'none';}

  function addRowButton(node, key, label, fn){if(!node||node.querySelector('[data-hotfix-key="'+key+'"]')) return; const btn=document.createElement('button'); btn.type='button'; btn.className='btn secondary small'; btn.textContent=label; btn.dataset.hotfixKey=key; btn.addEventListener('click',fn); let row=node.querySelector('.row.wrap,.row'); if(!row){row=document.createElement('div'); row.className='row wrap'; node.appendChild(row);} row.insertBefore(btn,row.firstChild);}
  function currentSearchItems(t){const k=($('searchKeyword')?.value||'').trim().toLowerCase(); const d=$('searchDate')?.value||''; return [...(t.expenses||[])].filter(e=>{if(d&&e.date!==d)return false; if(!k)return true; const hay=[e.title,e.category,e.note,personName(t,e.payerId),e.payerType==='pool'?'現金池':'',...(e.sharerIds||[]).map(id=>personName(t,id))].join(' ').toLowerCase(); return hay.includes(k);}).sort(sortDesc);}
  function enhanceLists(){
    ensureEditUi(); const s=load(), t=activeTrip(s); if(!t) return;
    const exs=[...(t.expenses||[])].sort(sortDesc); Array.from(document.querySelectorAll('#expensesList .item')).forEach((n,i)=>{const ex=exs[i]; if(ex) addRowButton(n,'edit-ex-'+ex.id,'編輯',()=>beginEditExpense(ex.id));});
    const search=currentSearchItems(t); Array.from(document.querySelectorAll('#searchResult .item')).forEach((n,i)=>{const ex=search[i]; if(ex) addRowButton(n,'edit-search-'+ex.id,'編輯',()=>beginEditExpense(ex.id));});
    const pools=[...(t.poolContributions||[])].sort(sortDesc); Array.from(document.querySelectorAll('#poolList .item')).forEach((n,i)=>{const rec=pools[i]; if(rec) addRowButton(n,'edit-pool-'+rec.id,'編輯',()=>beginEditPool(rec.id));});
    const expenseLinks=(t.expenses||[]).filter(e=>e.receiptUrl).map(e=>({id:'ex-'+e.id,date:e.date,type:'支出收據',title:e.title,url:e.receiptUrl,note:e.note,expense:true}));
    const links=[...(t.links||[]).map(l=>Object.assign({},l,{expense:false})),...expenseLinks].sort(sortDesc); Array.from(document.querySelectorAll('#linkList .item')).forEach((n,i)=>{const l=links[i]; if(l&&!l.expense) addRowButton(n,'edit-link-'+l.id,'編輯',()=>beginEditLink(l.id));});
  }
  function beginEditExpense(id){const s=load(), t=activeTrip(s), ex=byId(t?.expenses,id); if(!ex) return toast('找不到這筆支出'); editingExpenseId=id; switchTab('expense'); setTimeout(()=>{setVal('expenseDate',ex.date||today()); setVal('expenseTitle',ex.title||''); setVal('expenseAmount',ex.amount||''); setVal('expenseCurrency',ex.currency||'TWD'); setVal('expenseCategory',ex.category||'其他'); setVal('expenseReceiptUrl',ex.receiptUrl||''); setVal('expenseNote',ex.note||''); (ex.payerType==='pool'?$('payerPoolMode'):$('payerPersonMode'))?.click(); setTimeout(()=>{setVal('expensePayer',ex.payerId||''); document.querySelectorAll('#sharerList input').forEach(i=>{i.checked=(ex.sharerIds||[]).includes(i.value); i.parentElement?.classList.toggle('active',i.checked);}); setExpenseEditMode(true); window.scrollTo({top:0,behavior:'smooth'});},80);},80);}
  function beginEditPool(id){const s=load(), t=activeTrip(s), rec=byId(t?.poolContributions,id); if(!rec) return toast('找不到這筆現金池紀錄'); editingPoolId=id; switchTab('pool'); setTimeout(()=>{setVal('poolDate',rec.date||today()); setVal('poolPerson',rec.personId||''); setVal('poolAmount',rec.amount||''); setVal('poolCurrency',rec.currency||'TWD'); setVal('poolNote',rec.note||''); setPoolEditMode(true); window.scrollTo({top:0,behavior:'smooth'});},80);}
  function beginEditLink(id){const s=load(), t=activeTrip(s), l=byId(t?.links,id); if(!l) return toast('找不到這個連結'); editingLinkId=id; switchTab('links'); setTimeout(()=>{setVal('linkDate',l.date||today()); setVal('linkType',l.type||'收據'); setVal('linkTitle',l.title||''); setVal('linkUrl',l.url||''); setVal('linkNote',l.note||''); setLinkEditMode(true); window.scrollTo({top:0,behavior:'smooth'});},80);}
  function updateExpense(){const s=load(), t=activeTrip(s), ex=byId(t?.expenses,editingExpenseId); if(!ex) return toast('找不到這筆支出'); const amount=Number($('expenseAmount')?.value)||0, title=($('expenseTitle')?.value||'').trim(), receipt=($('expenseReceiptUrl')?.value||'').trim(), sharers=checkedSharers(); if(!title)return toast('請輸入項目名稱'); if(!amount||amount<=0)return toast('請輸入正確金額'); if(!sharers.length)return toast('至少要選一位分攤者'); if(!validUrl(receipt))return toast('連結請用 http 或 https 開頭'); ex.date=$('expenseDate')?.value||today(); ex.title=title; ex.amount=amount; ex.currency=$('expenseCurrency')?.value||'TWD'; ex.category=$('expenseCategory')?.value||'其他'; ex.payerType=currentPayerType(); ex.payerId=ex.payerType==='person'?($('expensePayer')?.value||''):''; ex.sharerIds=sharers; ex.note=($('expenseNote')?.value||'').trim(); ex.receiptUrl=receipt; save(s); toast('已更新支出紀錄'); setTimeout(()=>location.reload(),500);}
  function updatePool(){const s=load(), t=activeTrip(s), rec=byId(t?.poolContributions,editingPoolId); if(!rec)return toast('找不到這筆現金池紀錄'); const amount=Number($('poolAmount')?.value)||0, personId=$('poolPerson')?.value||''; if(!personId)return toast('請選擇旅伴'); if(!amount||amount<=0)return toast('請輸入正確金額'); rec.date=$('poolDate')?.value||today(); rec.personId=personId; rec.amount=amount; rec.currency=$('poolCurrency')?.value||'TWD'; rec.note=($('poolNote')?.value||'').trim(); save(s); toast('已更新現金池紀錄'); setTimeout(()=>location.reload(),500);}
  function updateLink(){const s=load(), t=activeTrip(s), l=byId(t?.links,editingLinkId); if(!l)return toast('找不到這個連結'); const title=($('linkTitle')?.value||'').trim(), url=($('linkUrl')?.value||'').trim(); if(!title)return toast('請輸入連結名稱'); if(!validUrl(url)||!url)return toast('請輸入 http 或 https 開頭的連結'); l.date=$('linkDate')?.value||today(); l.type=$('linkType')?.value||'收據'; l.title=title; l.url=url; l.note=($('linkNote')?.value||'').trim(); save(s); toast('已更新連結'); setTimeout(()=>location.reload(),500);}

  function addDownloadNotice(){function filename(kind){const s=load(),t=activeTrip(s); return kind==='all'?'米兔分帳全部行程_'+today()+'.json':'米兔分帳_'+((t&&t.name)||'目前行程')+'_'+today()+'.json';} function show(name){let box=$('downloadNotice'); if(!box){box=document.createElement('div'); box.id='downloadNotice'; box.className='note'; box.style.marginTop='10px'; $('exportTripBtn')?.parentElement?.after(box);} if(box){box.style.display='block'; box.innerHTML='<strong>已送出下載：</strong>'+name+'<br>Android 通常可在「檔案／Files → Download／下載」找到；也可到「Chrome → ⋮ → 下載內容」查看。<br><span class="hint">提醒：瀏覽器基於隱私限制，不會把完整實際路徑交給 PWA。</span>';}} $('exportAllBtn')?.addEventListener('click',()=>setTimeout(()=>show(filename('all')),80),true); $('exportTripBtn')?.addEventListener('click',()=>setTimeout(()=>show(filename('trip')),80),true);}
  function addHomeLedger(){if($('topLedgerShortcutBtn'))return; const bar=document.querySelector('.tripbar'); if(!bar)return; const b=document.createElement('button'); b.id='topLedgerShortcutBtn'; b.type='button'; b.className='btn full'; b.textContent='📒 查看個人帳簿'; b.addEventListener('click',()=>switchTab('ledger')); bar.appendChild(b);}
  function addUpdateLog(){const page=$('page-data'); if(!page||$('v132UpdateLog'))return; const card=document.createElement('div'); card.className='card'; card.id='v132UpdateLog'; card.innerHTML='<h2>更新記錄</h2><div class="list"><div class="item"><div class="item-title">V1.3.2｜線上版編輯功能修正</div><div class="item-meta">修正 GitHub Pages 線上版沒有出現編輯按鈕；支出、現金池、雲端連結可編輯。</div></div><div class="item"><div class="item-title">V1.3.1｜JSON 匯出位置提示</div><div class="item-meta">匯出 JSON 後顯示 Android 常見下載位置。</div></div><div class="item"><div class="item-title">V1.3.0｜既有紀錄可編輯</div><div class="item-meta">支出、現金池、雲端連結新增編輯。</div></div></div>'; page.insertBefore(card,page.children[1]||null);}

  function addCustomSplit(){if($('customSplitMode')||!$('sharerList'))return; const h=document.createElement('h3'); h.textContent='分攤方式'; const seg=document.createElement('div'); seg.className='seg no-print'; const equal=document.createElement('button'); equal.type='button'; equal.className='active'; equal.textContent='平均分攤'; const custom=document.createElement('button'); custom.id='customSplitMode'; custom.type='button'; custom.textContent='自訂分攤金額'; seg.append(equal,custom); const box=document.createElement('div'); box.id='customSplitBox'; box.style.cssText='display:none;margin-top:10px'; box.innerHTML='<div class="note">適合點餐各吃各的：例如總額 190，甲 100、乙 90。系統會自動拆成個人明細。</div><div id="customShareList"></div><div id="customShareSum" style="margin-top:6px;font-weight:950"></div>'; $('sharerList').after(h,seg,box); function inputs(){const list=$('customShareList'); if(!list)return; list.innerHTML=''; Array.from(document.querySelectorAll('#sharerList input:checked')).forEach(i=>{const row=document.createElement('div'); row.style.cssText='display:grid;grid-template-columns:1fr 130px;gap:8px;align-items:center;margin:6px 0'; const name=document.createElement('div'); name.textContent=i.parentElement?.textContent.trim()||i.value; const inp=document.createElement('input'); inp.type='number'; inp.min='0'; inp.step='0.01'; inp.dataset.personId=i.value; inp.placeholder='0'; inp.addEventListener('input',sum); row.append(name,inp); list.appendChild(row);}); sum();} function sum(){let total=0; document.querySelectorAll('#customShareList input').forEach(i=>total+=Number(i.value)||0); const amount=Number($('expenseAmount')?.value)||0; if($('customShareSum')) $('customShareSum').textContent='自訂分攤合計：'+money(total)+'｜總金額：'+money(amount);} equal.addEventListener('click',()=>{customMode=false;equal.classList.add('active');custom.classList.remove('active');box.style.display='none';}); custom.addEventListener('click',()=>{customMode=true;custom.classList.add('active');equal.classList.remove('active');box.style.display='block';inputs();}); $('sharerList').addEventListener('change',()=>{if(customMode)inputs();}); $('expenseAmount')?.addEventListener('input',sum);}
  function saveCustomSplit(){const s=load(), t=activeTrip(s); if(!t)return; const amount=Number($('expenseAmount')?.value)||0, title=($('expenseTitle')?.value||'').trim(), receipt=($('expenseReceiptUrl')?.value||'').trim(); if(!title)return toast('請輸入項目名稱'); if(!amount||amount<=0)return toast('請輸入正確金額'); if(!validUrl(receipt))return toast('連結請用 http 或 https 開頭'); const shares=[]; let sum=0; document.querySelectorAll('#customShareList input').forEach(i=>{const v=Number(i.value)||0; if(v>0){shares.push({id:i.dataset.personId,name:i.parentElement?.firstChild?.textContent||i.dataset.personId,amount:v}); sum+=v;}}); if(!shares.length)return toast('請輸入自訂分攤金額'); if(Math.abs(sum-amount)>0.005)return toast('自訂分攤合計需等於總金額'); const base={createdAt:new Date().toISOString(),date:$('expenseDate')?.value||today(),currency:$('expenseCurrency')?.value||'TWD',category:$('expenseCategory')?.value||'其他',payerType:currentPayerType(),payerId:currentPayerType()==='person'?($('expensePayer')?.value||''):'',receiptUrl:receipt}; const note=($('expenseNote')?.value||'').trim(); shares.forEach(x=>t.expenses.push(Object.assign({},base,{id:'id-'+Date.now()+'-'+Math.random().toString(16).slice(2),title:title+'－'+x.name,amount:x.amount,sharerIds:[x.id],note:(note?note+'｜':'')+'自訂分攤：原總額 '+money(amount)}))); save(s); toast('已儲存自訂分攤'); setTimeout(()=>location.reload(),500);}

  function bind(){
    ensureEditUi(); addHomeLedger(); addUpdateLog(); addDownloadNotice(); addCustomSplit(); enhanceLists();
    document.addEventListener('click',function(e){
      if(e.target?.id==='saveExpenseBtn'&&editingExpenseId){e.preventDefault();e.stopImmediatePropagation();updateExpense();}
      else if(e.target?.id==='saveExpenseBtn'&&customMode){e.preventDefault();e.stopImmediatePropagation();saveCustomSplit();}
      else if(e.target?.id==='savePoolBtn'&&editingPoolId){e.preventDefault();e.stopImmediatePropagation();updatePool();}
      else if(e.target?.id==='saveLinkBtn'&&editingLinkId){e.preventDefault();e.stopImmediatePropagation();updateLink();}
    },true);
    const obs=new MutationObserver(()=>enhanceLists()); ['expensesList','searchResult','poolList','linkList'].forEach(id=>{const n=$(id); if(n) obs.observe(n,{childList:true,subtree:false});});
    setInterval(enhanceLists,1200);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();
</script>`;
  if(!out.includes('mitu-v132-edit-hotfix')) out = out.replace('</body>', injector + '</body>');
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