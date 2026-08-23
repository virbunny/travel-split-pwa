const CACHE_NAME = 'mitu-travel-split-v1-3-3-edit-fix';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.3.3')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.3.3')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.3.3')
    .replaceAll('米兔分帳小幫手 V1.2.9', '米兔分帳小幫手 V1.3.3')
    .replaceAll('米兔分帳小幫手 V1.3.1', '米兔分帳小幫手 V1.3.3')
    .replaceAll('米兔分帳小幫手 V1.3.2', '米兔分帳小幫手 V1.3.3')
    .replaceAll('V1.2.6', 'V1.3.3')
    .replaceAll('V1.2.7', 'V1.3.3')
    .replaceAll('V1.2.8', 'V1.3.3')
    .replaceAll('V1.2.9', 'V1.3.3')
    .replaceAll('V1.3.1', 'V1.3.3')
    .replaceAll('V1.3.2', 'V1.3.3');

  const injector = `<script id="mitu-v133-edit-fix">
(function(){
  const KEY='mituTravelSplit.v1_1';
  const $=id=>document.getElementById(id);
  let editingExpenseId=null, editingPoolId=null, editingLinkId=null, customSplit=false;
  const today=()=>new Date().toISOString().slice(0,10);
  const id=()=> (crypto&&crypto.randomUUID) ? crypto.randomUUID() : 'id-'+Date.now()+'-'+Math.random().toString(16).slice(2);
  function load(){try{const s=JSON.parse(localStorage.getItem(KEY)); if(s&&Array.isArray(s.trips)) return s;}catch(e){} return null;}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));}
  function trip(s){if(!s||!s.trips||!s.trips.length)return null; return s.trips.find(t=>t.id===s.currentTripId)||s.trips[0];}
  function sortDesc(a,b){return String(b.date||'').localeCompare(String(a.date||'')) || String(b.createdAt||'').localeCompare(String(a.createdAt||''));}
  function personName(t,pid){return ((t.people||[]).find(p=>p.id===pid)||{}).name||'已刪除旅伴';}
  function setVal(id,v){const e=$(id); if(e) e.value=(v==null?'':v);}
  function toast(msg){const box=$('toast'); if(box){box.textContent=msg; box.classList.add('show'); clearTimeout(window.__mituToast); window.__mituToast=setTimeout(()=>box.classList.remove('show'),2200);} else alert(msg);}
  function switchTab(name){document.querySelector('.tab-btn[data-tab="'+name+'"]')?.click();}
  function checkedSharers(){return Array.from(document.querySelectorAll('#sharerList input:checked')).map(i=>i.value);}
  function validUrl(u){return !u || /^https?:\/\//i.test(u);}
  function payerType(){return $('payerPoolMode')?.classList.contains('active') ? 'pool' : 'person';}
  function setActivePills(){document.querySelectorAll('#sharerList input').forEach(i=>i.parentElement?.classList.toggle('active',i.checked));}

  function ensureEditControls(){
    const exGrid=$('saveExpenseBtn')?.closest('.grid');
    if(exGrid && !$('cancelExpenseEditV133')){
      const note=document.createElement('div'); note.id='expenseEditNoteV133'; note.className='note'; note.style.display='none'; note.textContent='正在編輯既有支出，修改後請按「更新這一筆」。'; exGrid.before(note);
      const c=document.createElement('button'); c.id='cancelExpenseEditV133'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingExpenseId=null; setExpenseMode(false); $('resetExpenseFormBtn')?.click();}); exGrid.appendChild(c);
    }
    const poolGrid=$('savePoolBtn')?.closest('.grid');
    if(poolGrid && !$('cancelPoolEditV133')){
      const note=document.createElement('div'); note.id='poolEditNoteV133'; note.className='note'; note.style.display='none'; note.textContent='正在編輯現金池紀錄。'; poolGrid.before(note);
      const c=document.createElement('button'); c.id='cancelPoolEditV133'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingPoolId=null; setPoolMode(false); setVal('poolAmount',''); setVal('poolNote','');}); poolGrid.appendChild(c);
    }
    const linkGrid=$('saveLinkBtn')?.closest('.grid');
    if(linkGrid && !$('cancelLinkEditV133')){
      const note=document.createElement('div'); note.id='linkEditNoteV133'; note.className='note'; note.style.display='none'; note.textContent='正在編輯雲端連結。'; linkGrid.before(note);
      const c=document.createElement('button'); c.id='cancelLinkEditV133'; c.type='button'; c.className='btn secondary full'; c.textContent='取消編輯'; c.style.display='none'; c.addEventListener('click',()=>{editingLinkId=null; setLinkMode(false); setVal('linkTitle',''); setVal('linkUrl',''); setVal('linkNote','');}); linkGrid.appendChild(c);
    }
  }
  function setExpenseMode(on){ensureEditControls(); if($('saveExpenseBtn')) $('saveExpenseBtn').textContent=on?'更新這一筆':'儲存這一筆'; if($('expenseEditNoteV133')) $('expenseEditNoteV133').style.display=on?'block':'none'; if($('cancelExpenseEditV133')) $('cancelExpenseEditV133').style.display=on?'block':'none';}
  function setPoolMode(on){ensureEditControls(); if($('savePoolBtn')) $('savePoolBtn').textContent=on?'更新現金池':'加入現金池'; if($('poolEditNoteV133')) $('poolEditNoteV133').style.display=on?'block':'none'; if($('cancelPoolEditV133')) $('cancelPoolEditV133').style.display=on?'block':'none';}
  function setLinkMode(on){ensureEditControls(); if($('saveLinkBtn')) $('saveLinkBtn').textContent=on?'更新連結':'儲存連結'; if($('linkEditNoteV133')) $('linkEditNoteV133').style.display=on?'block':'none'; if($('cancelLinkEditV133')) $('cancelLinkEditV133').style.display=on?'block':'none';}

  function rowFor(node){let row=node.querySelector('.row.wrap,.row'); if(!row){row=document.createElement('div'); row.className='row wrap'; node.appendChild(row);} return row;}
  function addEdit(node,key,fn){if(!node || node.querySelector('[data-v133="'+key+'"]')) return; const b=document.createElement('button'); b.type='button'; b.className='btn secondary small'; b.textContent='編輯'; b.dataset.v133=key; b.addEventListener('click',fn); rowFor(node).insertBefore(b,rowFor(node).firstChild);}
  function searchItems(t){const k=($('searchKeyword')?.value||'').trim().toLowerCase(); const d=$('searchDate')?.value||''; return [...(t.expenses||[])].filter(e=>{if(d && e.date!==d)return false; if(!k)return true; const hay=[e.title,e.category,e.note,e.currency,personName(t,e.payerId),...(e.sharerIds||[]).map(x=>personName(t,x))].join(' ').toLowerCase(); return hay.includes(k);}).sort(sortDesc);}
  function enhanceLists(){
    ensureEditControls(); const s=load(), t=trip(s); if(!t)return;
    const all=[...(t.expenses||[])].sort(sortDesc);
    document.querySelectorAll('#expensesList .item').forEach((n,i)=>{const ex=all[i]; if(ex)addEdit(n,'ex-'+ex.id,()=>beginEditExpense(ex.id));});
    document.querySelectorAll('#recentExpenses .item').forEach((n,i)=>{const ex=all.slice(0,5)[i]; if(ex)addEdit(n,'home-ex-'+ex.id,()=>beginEditExpense(ex.id));});
    const searched=searchItems(t); document.querySelectorAll('#searchResult .item').forEach((n,i)=>{const ex=searched[i]; if(ex)addEdit(n,'search-ex-'+ex.id,()=>beginEditExpense(ex.id));});
    const pools=[...(t.poolContributions||[])].sort(sortDesc); document.querySelectorAll('#poolList .item').forEach((n,i)=>{const rec=pools[i]; if(rec)addEdit(n,'pool-'+rec.id,()=>beginEditPool(rec.id));});
    const linkItems=[...(t.links||[])].sort(sortDesc); document.querySelectorAll('#linkList .item').forEach((n,i)=>{const l=linkItems[i]; if(l)addEdit(n,'link-'+l.id,()=>beginEditLink(l.id));});
  }

  function beginEditExpense(eid){const s=load(), t=trip(s), ex=(t?.expenses||[]).find(e=>e.id===eid); if(!ex)return toast('找不到這筆支出'); editingExpenseId=eid; switchTab('expense'); setTimeout(()=>{setVal('expenseDate',ex.date||today()); setVal('expenseTitle',ex.title||''); setVal('expenseAmount',ex.amount||''); setVal('expenseCurrency',ex.currency||'TWD'); setVal('expenseCategory',ex.category||'其他'); setVal('expenseReceiptUrl',ex.receiptUrl||''); setVal('expenseNote',ex.note||''); (ex.payerType==='pool'?$('payerPoolMode'):$('payerPersonMode'))?.click(); setTimeout(()=>{setVal('expensePayer',ex.payerId||''); document.querySelectorAll('#sharerList input').forEach(i=>{i.checked=(ex.sharerIds||[]).includes(i.value);}); setActivePills(); if($('customSplitBox')) $('customSplitBox').style.display='none'; customSplit=false; setExpenseMode(true); window.scrollTo({top:0,behavior:'smooth'});},120);},120);}
  function beginEditPool(pid){const s=load(), t=trip(s), rec=(t?.poolContributions||[]).find(r=>r.id===pid); if(!rec)return toast('找不到這筆現金池紀錄'); editingPoolId=pid; switchTab('pool'); setTimeout(()=>{setVal('poolDate',rec.date||today()); setVal('poolPerson',rec.personId||''); setVal('poolAmount',rec.amount||''); setVal('poolCurrency',rec.currency||'TWD'); setVal('poolNote',rec.note||''); setPoolMode(true); window.scrollTo({top:0,behavior:'smooth'});},120);}
  function beginEditLink(lid){const s=load(), t=trip(s), l=(t?.links||[]).find(x=>x.id===lid); if(!l)return toast('找不到這個連結'); editingLinkId=lid; switchTab('links'); setTimeout(()=>{setVal('linkDate',l.date||today()); setVal('linkType',l.type||'收據'); setVal('linkTitle',l.title||''); setVal('linkUrl',l.url||''); setVal('linkNote',l.note||''); setLinkMode(true); window.scrollTo({top:0,behavior:'smooth'});},120);}

  function updateExpense(){const s=load(), t=trip(s), ex=(t?.expenses||[]).find(e=>e.id===editingExpenseId); if(!ex)return toast('找不到這筆支出'); const amount=Number($('expenseAmount')?.value)||0, title=($('expenseTitle')?.value||'').trim(), receipt=($('expenseReceiptUrl')?.value||'').trim(), sharers=checkedSharers(); if(!title)return toast('請輸入項目名稱'); if(!amount||amount<=0)return toast('請輸入正確金額'); if(!sharers.length)return toast('至少要選一位分攤者'); if(!validUrl(receipt))return toast('連結請用 http 或 https 開頭'); ex.date=$('expenseDate')?.value||today(); ex.title=title; ex.amount=amount; ex.currency=$('expenseCurrency')?.value||'TWD'; ex.category=$('expenseCategory')?.value||'其他'; ex.payerType=payerType(); ex.payerId=ex.payerType==='person'?($('expensePayer')?.value||''):''; ex.sharerIds=sharers; ex.receiptUrl=receipt; ex.note=($('expenseNote')?.value||'').trim(); save(s); toast('已更新支出紀錄'); setTimeout(()=>location.reload(),450);}
  function updatePool(){const s=load(), t=trip(s), rec=(t?.poolContributions||[]).find(r=>r.id===editingPoolId); if(!rec)return toast('找不到這筆現金池紀錄'); const amt=Number($('poolAmount')?.value)||0, person=$('poolPerson')?.value||''; if(!person)return toast('請選擇旅伴'); if(!amt||amt<=0)return toast('請輸入正確金額'); rec.date=$('poolDate')?.value||today(); rec.personId=person; rec.amount=amt; rec.currency=$('poolCurrency')?.value||'TWD'; rec.note=($('poolNote')?.value||'').trim(); save(s); toast('已更新現金池紀錄'); setTimeout(()=>location.reload(),450);}
  function updateLink(){const s=load(), t=trip(s), l=(t?.links||[]).find(x=>x.id===editingLinkId); if(!l)return toast('找不到這個連結'); const title=($('linkTitle')?.value||'').trim(), url=($('linkUrl')?.value||'').trim(); if(!title)return toast('請輸入連結名稱'); if(!url||!validUrl(url))return toast('請輸入 http 或 https 開頭的連結'); l.date=$('linkDate')?.value||today(); l.type=$('linkType')?.value||'收據'; l.title=title; l.url=url; l.note=($('linkNote')?.value||'').trim(); save(s); toast('已更新連結'); setTimeout(()=>location.reload(),450);}

  function bindUpdateButtons(){
    const ex=$('saveExpenseBtn'); if(ex&&!ex.dataset.v133){ex.dataset.v133='1'; ex.addEventListener('click',ev=>{if(editingExpenseId){ev.preventDefault();ev.stopImmediatePropagation();updateExpense();} else if(customSplit){ev.preventDefault();ev.stopImmediatePropagation();saveCustomSplit();}},true);}
    const pool=$('savePoolBtn'); if(pool&&!pool.dataset.v133){pool.dataset.v133='1'; pool.addEventListener('click',ev=>{if(editingPoolId){ev.preventDefault();ev.stopImmediatePropagation();updatePool();}},true);}
    const link=$('saveLinkBtn'); if(link&&!link.dataset.v133){link.dataset.v133='1'; link.addEventListener('click',ev=>{if(editingLinkId){ev.preventDefault();ev.stopImmediatePropagation();updateLink();}},true);}
  }

  function selectedPeople(){const s=load(), t=trip(s); return checkedSharers().map(pid=>({id:pid,name:personName(t,pid)}));}
  function updateCustomSum(){const box=$('customShareSum'); if(!box)return; const total=Number($('expenseAmount')?.value)||0; let sum=0; document.querySelectorAll('#customShareList input[data-person-id]').forEach(i=>sum+=Number(i.value)||0); const diff=Math.round((sum-total)*100)/100; box.textContent='自訂分攤合計：'+sum.toLocaleString('zh-TW')+'｜總金額：'+total.toLocaleString('zh-TW')+(Math.abs(diff)<0.005?'':'｜差額：'+Math.abs(diff).toLocaleString('zh-TW')); box.style.color=Math.abs(diff)<0.005?'#4f89a3':'#b4534c'; box.style.fontWeight='950';}
  function renderCustomRows(){const list=$('customShareList'); if(!list)return; const old={}; list.querySelectorAll('input[data-person-id]').forEach(i=>old[i.dataset.personId]=i.value); list.innerHTML=''; if(!customSplit){updateCustomSum();return;} selectedPeople().forEach(p=>{const row=document.createElement('div'); row.style.cssText='display:grid;grid-template-columns:1fr 140px;gap:8px;align-items:center;border:1px solid #d9e5bb;border-radius:14px;background:#fff;padding:8px 10px;margin-bottom:8px'; const name=document.createElement('div'); name.textContent=p.name; name.style.cssText='font-weight:950;color:#5f742b'; const input=document.createElement('input'); input.type='number'; input.min='0'; input.step='0.01'; input.inputMode='decimal'; input.placeholder='0'; input.dataset.personId=p.id; input.value=old[p.id]||''; input.addEventListener('input',updateCustomSum); row.append(name,input); list.appendChild(row);}); updateCustomSum();}
  function addCustomSplitUi(){if($('customSplitMode'))return; const share=$('sharerList'); if(!share)return; const h=document.createElement('h3'); h.textContent='分攤方式'; const seg=document.createElement('div'); seg.className='seg no-print'; const eq=document.createElement('button'); eq.type='button'; eq.className='btn active'; eq.textContent='平均分攤'; const cu=document.createElement('button'); cu.type='button'; cu.id='customSplitMode'; cu.className='btn'; cu.textContent='自訂分攤金額'; seg.append(eq,cu); const box=document.createElement('div'); box.id='customSplitBox'; box.style.cssText='display:none;margin-top:10px'; box.innerHTML='<div class="note">適合點餐各吃各的：例如總額 190，甲 100、乙 90。系統會自動拆成個人明細。</div><div id="customShareList"></div><div id="customShareSum" style="margin-top:6px"></div>'; share.after(h,seg,box); eq.addEventListener('click',()=>{customSplit=false; eq.classList.add('active'); cu.classList.remove('active'); box.style.display='none'; renderCustomRows();}); cu.addEventListener('click',()=>{customSplit=true; cu.classList.add('active'); eq.classList.remove('active'); box.style.display='block'; renderCustomRows();}); $('expenseAmount')?.addEventListener('input',updateCustomSum); $('sharerList')?.addEventListener('change',()=>{setActivePills();renderCustomRows();});}
  function saveCustomSplit(){const total=Number($('expenseAmount')?.value)||0, title=($('expenseTitle')?.value||'').trim(); if(!title)return toast('請輸入項目名稱'); if(!total||total<=0)return toast('請輸入正確金額'); const shares=[]; let sum=0; document.querySelectorAll('#customShareList input[data-person-id]').forEach(i=>{const v=Number(i.value)||0; if(v>0){shares.push({id:i.dataset.personId,amount:v,name:i.parentElement.firstChild.textContent}); sum+=v;}}); if(!shares.length)return toast('請輸入至少一位旅伴的自訂分攤金額'); if(Math.abs(sum-total)>0.005)return toast('自訂分攤合計需等於總金額'); const s=load(), t=trip(s); if(!t)return toast('找不到目前行程'); const currency=$('expenseCurrency')?.value||'TWD', note=($('expenseNote')?.value||'').trim(), base={createdAt:new Date().toISOString(),date:$('expenseDate')?.value||today(),currency,category:$('expenseCategory')?.value||'其他',payerType:payerType(),payerId:payerType()==='person'?($('expensePayer')?.value||''):'',receiptUrl:($('expenseReceiptUrl')?.value||'').trim()}; shares.forEach(sh=>t.expenses.push(Object.assign({},base,{id:id(),title:title+'－'+sh.name,amount:sh.amount,sharerIds:[sh.id],note:(note?note+'｜':'')+'自訂分攤：原總額 '+total.toLocaleString('zh-TW')+' '+currency}))); save(s); toast('已儲存自訂分攤'); setTimeout(()=>location.reload(),450);}

  function addDownloadNotice(){function fname(kind){const s=load(), t=trip(s); return kind==='all'?'米兔分帳全部行程_'+today()+'.json':'米兔分帳_'+((t&&t.name)||'目前行程')+'_'+today()+'.json';} function show(name){let box=$('downloadNotice'); if(!box){box=document.createElement('div'); box.id='downloadNotice'; box.className='note'; box.style.marginTop='10px'; $('exportTripBtn')?.parentElement?.after(box);} if(box) box.innerHTML='<strong>已送出下載：</strong>'+name+'<br>Android 通常可在「檔案／Files → Download／下載」找到；也可到「Chrome → ⋮ → 下載內容」查看。<br><span class="hint">瀏覽器基於隱私限制，不會把完整實際路徑交給 PWA。</span>'; } const all=$('exportAllBtn'), tr=$('exportTripBtn'); if(all&&!all.dataset.v133){all.dataset.v133='1'; all.addEventListener('click',()=>setTimeout(()=>show(fname('all')),80),true);} if(tr&&!tr.dataset.v133){tr.dataset.v133='1'; tr.addEventListener('click',()=>setTimeout(()=>show(fname('trip')),80),true);}}
  function addHomeLedger(){if($('topLedgerShortcutBtn'))return; const bar=document.querySelector('.tripbar'); if(!bar)return; const b=document.createElement('button'); b.id='topLedgerShortcutBtn'; b.type='button'; b.className='btn full'; b.textContent='📒 查看個人帳簿'; b.addEventListener('click',()=>switchTab('ledger')); bar.appendChild(b);}
  function addUpdateLog(){const page=$('page-data'); if(!page||$('v133UpdateLog'))return; const card=document.createElement('div'); card.className='card'; card.id='v133UpdateLog'; card.innerHTML='<h2>更新記錄</h2><div class="list"><div class="item"><div class="item-title">V1.3.3｜編輯入口修正</div><div class="item-meta">修正線上版費用列表只看到刪除、沒有編輯的問題。</div></div><div class="item"><div class="item-title">V1.3.1｜JSON 匯出位置提示</div><div class="item-meta">匯出 JSON 後顯示 Android 常見下載位置。</div></div><div class="item"><div class="item-title">V1.3.0｜既有紀錄可編輯</div><div class="item-meta">支出、現金池、雲端連結都可編輯。</div></div><div class="item"><div class="item-title">V1.2.9｜自訂分攤金額</div><div class="item-meta">新增點餐各吃各的自訂分攤。</div></div></div>'; page.insertBefore(card,page.children[1]||null);}

  function tick(){addCustomSplitUi(); ensureEditControls(); bindUpdateButtons(); addDownloadNotice(); addHomeLedger(); addUpdateLog(); enhanceLists();}
  function start(){tick(); setInterval(tick,700); const mo=new MutationObserver(()=>tick()); mo.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
</script>`;
  if(!out.includes('mitu-v133-edit-fix')) out = out.replace('</body>', injector + '</body>');
  return out;
}

async function indexResponse(request) {
  let response;
  try { response = await fetch(request, { cache: 'no-store' }); }
  catch (err) { response = await caches.match('./index.html') || await caches.match(request); }
  if (!response) return fetch(request);
  const text = await response.clone().text();
  return new Response(upgradeIndex(text), {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
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