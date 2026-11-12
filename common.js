// omega works 共通：ページの一番上から開く／一番上へ戻るボタン／作品の画面写真を拡大
(function(){
  // ページを開いたら一番上から（#付きのときはその場所へ）
  if('scrollRestoration' in history) history.scrollRestoration='manual';
  // （埋め込み表示のときは外側の画面ごと一番上へ動かすため scrollIntoView も使う）
  var head=document.querySelector('header')||document.body;
  function goTop(smooth){
    window.scrollTo({top:0,behavior:smooth?'smooth':'auto'});
    try{ head.scrollIntoView({block:'start',behavior:smooth?'smooth':'auto'}); }catch(e){}
  }
  window.addEventListener('load',function(){ if(!location.hash) goTop(false); });
  // 同じページの「#top」へのリンクも一番上へ
  document.querySelectorAll('a[href="#top"]').forEach(function(a){
    a.addEventListener('click',function(e){ e.preventDefault(); goTop(true); });
  });

  // 一番上へ戻るボタン
  var top=document.createElement('button');
  top.type='button'; top.className='to-top'; top.setAttribute('aria-label','ページの一番上へ戻る');
  top.innerHTML='<span class="arw">↑</span><span class="lbl">上へ</span>';
  document.body.appendChild(top);
  top.addEventListener('click',function(){ goTop(true); });
  function onScroll(){ top.classList.toggle('show', window.scrollY>500); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // 画面写真を押すと拡大
  var shots=document.querySelectorAll('.work .shot img');
  if(!shots.length) return;
  var box=document.createElement('div');
  box.className='zoom'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-label','画面写真の拡大');
  box.innerHTML='<button type="button" class="zoom-close" aria-label="閉じる">×</button><img alt=""><p class="zoom-cap"></p>';
  document.body.appendChild(box);
  var big=box.querySelector('img'), cap=box.querySelector('.zoom-cap'), closeBtn=box.querySelector('.zoom-close');
  function open(img){
    big.src=img.currentSrc||img.src; big.alt=img.alt||''; cap.textContent=img.alt||'';
    box.classList.add('open'); document.body.style.overflow='hidden'; closeBtn.focus();
  }
  function close(){ box.classList.remove('open'); document.body.style.overflow=''; }
  shots.forEach(function(img){
    var shot=img.closest('.shot'); shot.classList.add('zoomable');
    shot.setAttribute('tabindex','0'); shot.setAttribute('role','button'); shot.setAttribute('aria-label',(img.alt||'画面写真')+'を拡大');
    shot.addEventListener('click',function(){ open(img); });
    shot.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(img); } });
  });
  box.addEventListener('click',function(e){ if(e.target!==big) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && box.classList.contains('open')) close(); });
})();
