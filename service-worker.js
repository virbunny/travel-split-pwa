const CACHE_NAME = 'mitu-travel-split-v1-2-9-custom-split';
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
    .replaceAll('米兔分帳小幫手 V1.2.6', '米兔分帳小幫手 V1.2.9')
    .replaceAll('米兔分帳小幫手 V1.2.7', '米兔分帳小幫手 V1.2.9')
    .replaceAll('米兔分帳小幫手 V1.2.8', '米兔分帳小幫手 V1.2.9')
    .replaceAll('V1.2.6', 'V1.2.9')
    .replaceAll('V1.2.7', 'V1.2.9')
    .replaceAll('V1.2.8', 'V1.2.9');

  const injector = `<script id="mitu-v129-custom-split">
(function(){
  var customMode = false;
  function id(){ return (crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2); }
  function money(n){ return String(Number(n||0).toLocaleString('zh-TW')); }
  function currentCurrency(){ var el=document.getElementById('expenseCurrency'); return el ? el.value : 'TWD'; }
  function checkedPeople(){ return Array.from(document.querySelectorAll('#sharerList input:checked')).map(function(i){ return {id:i.value, name:(i.parentElement ? i.parentElement.textContent.trim() : i.value)}; }); }
  function parseState(){
    var raw=localStorage.getItem('mituTravelSplit.v1_1');
    if(raw){ try{return JSON.parse(raw);}catch(e){} }
    var tripSel=document.getElementById('currentTripSelect');
    var tripId=tripSel && tripSel.value ? tripSel.value : id();
    var people=Array.from(document.querySelectorAll('#expensePayer option')).map(function(o){return {id:o.value,name:o.textContent};});
    if(!people.length) people=checkedPeople();
    return {app:'米兔分帳小幫手',version:'1.2.9',currentTripId:tripId,trips:[{id:tripId,name:tripSel && tripSel.selectedOptions[0] ? tripSel.selectedOptions[0].textContent : '未命名行程',people:people,expenses:[],poolContributions:[],links:[]}]};
  }
  function activeTrip(state){
    var trip=state.trips.find(function(t){return t.id===state.currentTripId;});
    if(!trip){ trip=state.trips[0]; state.currentTripId=trip.id; }
    return trip;
  }
  function updateSum(){
    var sumEl=document.getElementById('customShareSum'); if(!sumEl) return;
    var amount=Number((document.getElementById('expenseAmount')||{}).value)||0;
    var sum=0; document.querySelectorAll('#customShareList input[data-person-id]').forEach(function(i){ sum += Number(i.value)||0; });
    var diff=Math.round((sum-amount)*100)/100;
    sumEl.textContent='自訂分攤合計：' + money(sum) + '｜總金額：' + money(amount) + (Math.abs(diff)<0.005 ? '' : '｜差額：' + money(Math.abs(diff)));
    sumEl.style.color = Math.abs(diff)<0.005 ? '#4f89a3' : '#b4534c';
    sumEl.style.fontWeight='950';
  }
  function renderCustomInputs(){
    var box=document.getElementById('customShareList'); if(!box) return;
    var old={}; box.querySelectorAll('input[data-person-id]').forEach(function(i){old[i.dataset.personId]=i.value;});
    box.innerHTML='';
    if(!customMode){ updateSum(); return; }
    checkedPeople().forEach(function(p){
      var row=document.createElement('div'); row.style.cssText='display:grid;grid-template-columns:1fr minmax(110px,160px);gap:8px;align-items:center;border:1px solid #d9e5bb;border-radius:14px;background:#fff;padding:8px 10px;margin-bottom:8px';
      var name=document.createElement('div'); name.textContent=p.name; name.style.cssText='font-weight:950;color:#5f742b';
      var input=document.createElement('input'); input.type='number'; input.min='0'; input.step='0.01'; input.inputMode='decimal'; input.placeholder='0'; input.dataset.personId=p.id; input.value=old[p.id]||''; input.addEventListener('input',updateSum);
      row.appendChild(name); row.appendChild(input); box.appendChild(row);
    });
    updateSum();
  }
  function addUI(){
    if(document.getElementById('customSplitMode')) return;
    var sharer=document.getElementById('sharerList'); if(!sharer) return;
    var h=document.createElement('h3'); h.textContent='分攤方式';
    var seg=document.createElement('div'); seg.className='seg no-print';
    var equal=document.createElement('button'); equal.id='equalSplitMode'; equal.type='button'; equal.className='btn active'; equal.textContent='平均分攤';
    var custom=document.createElement('button'); custom.id='customSplitMode'; custom.type='button'; custom.className='btn'; custom.textContent='自訂分攤金額';
    seg.appendChild(equal); seg.appendChild(custom);
    var box=document.createElement('div'); box.id='customSplitBox'; box.style.cssText='display:none;margin-top:10px';
    box.innerHTML='<div class="note">適合點餐各吃各的：例如總額 190，甲 100、乙 90。系統會自動拆成個人明細，合計必須等於總金額。</div><div id="customShareList"></div><div id="customShareSum" style="margin-top:6px"></div>';
    sharer.after(h,seg,box);
    equal.addEventListener('click',function(){customMode=false;equal.classList.add('active');custom.classList.remove('active');box.style.display='none';renderCustomInputs();});
    custom.addEventListener('click',function(){customMode=true;custom.classList.add('active');equal.classList.remove('active');box.style.display='block';renderCustomInputs();});
    document.getElementById('expenseAmount')?.addEventListener('input',updateSum);
    document.getElementById('expenseCurrency')?.addEventListener('change',updateSum);
    document.getElementById('sharerList')?.addEventListener('change',renderCustomInputs);
  }
  function saveCustom(e){
    if(!customMode) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var amount=Number((document.getElementById('expenseAmount')||{}).value)||0;
    var title=(document.getElementById('expenseTitle')||{}).value?.trim()||'';
    if(!title){ alert('請輸入項目名稱'); return; }
    if(!amount||amount<=0){ alert('請輸入正確金額'); return; }
    var shares=[]; var sum=0;
    document.querySelectorAll('#customShareList input[data-person-id]').forEach(function(i){ var v=Number(i.value)||0; if(v>0){ var name=(i.parentElement && i.parentElement.firstChild ? i.parentElement.firstChild.textContent : i.dataset.personId); shares.push({id:i.dataset.personId,name:name,amount:v}); sum+=v; } });
    if(!shares.length){ alert('請輸入至少一位旅伴的自訂分攤金額'); return; }
    if(Math.abs(sum-amount)>0.005){ alert('自訂分攤合計需等於總金額，目前合計 '+money(sum)+'，總金額 '+money(amount)); return; }
    var state=parseState(); var t=activeTrip(state);
    var currency=currentCurrency(); var now=new Date().toISOString();
    var payerPerson=document.getElementById('expensePayer'); var payerType=document.getElementById('payerPoolMode')?.classList.contains('active') ? 'pool' : 'person';
    var base={createdAt:now,date:document.getElementById('expenseDate')?.value||now.slice(0,10),currency:currency,category:document.getElementById('expenseCategory')?.value||'其他',payerType:payerType,payerId:payerType==='person' && payerPerson ? payerPerson.value : '',receiptUrl:document.getElementById('expenseReceiptUrl')?.value.trim()||''};
    var note0=document.getElementById('expenseNote')?.value.trim()||'';
    shares.forEach(function(s){
      t.expenses.push(Object.assign({},base,{id:id(),title:title+'－'+s.name,amount:s.amount,sharerIds:[s.id],note:(note0 ? note0+'｜' : '')+'自訂分攤：原總額 '+money(amount)+' '+currency}));
    });
    localStorage.setItem('mituTravelSplit.v1_1',JSON.stringify(state));
    alert('已儲存自訂分攤，並自動拆成 '+shares.length+' 筆個人明細。');
    location.reload();
  }
  function addUpdateLog(){
    var page=document.getElementById('page-data'); if(!page || document.getElementById('v129UpdateLog')) return;
    var card=document.createElement('div'); card.className='card'; card.id='v129UpdateLog';
    card.innerHTML='<h2>更新記錄</h2><div class="list"><div class="item"><div class="item-title">V1.2.9｜自訂分攤金額</div><div class="item-meta">新增支出可選自訂分攤金額，適合點餐各吃各的；系統會自動拆成個人明細。</div></div></div>';
    page.insertBefore(card,page.children[1]||null);
  }
  function run(){
    addUI(); addUpdateLog();
    var save=document.getElementById('saveExpenseBtn'); if(save && !save.dataset.customSplitBound){ save.dataset.customSplitBound='1'; save.addEventListener('click',saveCustom,true); }
    setTimeout(addUI,300);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
</script>`;
  if(!out.includes('mitu-v129-custom-split')) out = out.replace('</body>', injector + '</body>');
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