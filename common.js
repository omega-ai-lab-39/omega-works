// omega works 共通：ページの一番上から開く／一番上へ戻るボタン／作品の画面写真を拡大
(function(){
  // ページを開いたら一番上から（#付きのときはその場所へ）
  if('scrollRestoration' in history) history.scrollRestoration='manual';
  // （埋め込み表示のときは外側の画面ごと一番上へ動かすため scrollIntoView も使う）
  var inFrame=false; try{ inFrame=window.self!==window.top; }catch(e){ inFrame=true; }
  function goTop(smooth){
    var b=smooth?'smooth':'auto';
    if(inFrame){ try{ document.documentElement.scrollIntoView({block:'start',behavior:b}); return; }catch(e){} }
    window.scrollTo({top:0,behavior:b});
  }
  window.addEventListener('load',function(){ if(!location.hash) goTop(false); });
  // 同じページの「#top」へのリンクも一番上へ
  document.querySelectorAll('a[href="#top"]').forEach(function(a){
    a.addEventListener('click',function(e){ e.preventDefault(); goTop(true); });
  });

  // スマホ：三本線のメニュー
  var head=document.querySelector('.head'), nav=head&&head.querySelector('nav');
  if(nav){
    if(!nav.id) nav.id='site-nav';
    var mb=document.createElement('button');
    mb.type='button'; mb.className='menu-btn'; mb.setAttribute('aria-controls',nav.id); mb.setAttribute('aria-expanded','false'); mb.setAttribute('aria-label','メニューを開く');
    mb.innerHTML='<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="mlbl">メニュー</span>';
    nav.parentNode.insertBefore(mb,nav);
    var shade=document.createElement('div'); shade.className='menu-shade'; document.body.appendChild(shade);
    function setMenu(on){
      document.body.classList.toggle('menu-open',on);
      mb.setAttribute('aria-expanded',on?'true':'false');
      mb.setAttribute('aria-label',on?'メニューを閉じる':'メニューを開く');
      mb.querySelector('.mlbl').textContent=on?'とじる':'メニュー';
    }
    mb.addEventListener('click',function(){ setMenu(!document.body.classList.contains('menu-open')); });
    shade.addEventListener('click',function(){ setMenu(false); });
    // メニューの中の「#〇〇」は、メニューを閉じてから その場所へ動かす（開いている間は画面が止まっているため）
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(e){
      var open=document.body.classList.contains('menu-open'); setMenu(false);
      var h=a.getAttribute('href')||'';
      if(!open || h.charAt(0)!=='#') return;
      if(h==='#top'){ setTimeout(function(){ goTop(true); },30); return; }
      var t=document.getElementById(h.slice(1)); if(!t) return;
      e.preventDefault();
      setTimeout(function(){ t.scrollIntoView({behavior:'smooth',block:'start'}); if(history.pushState) history.pushState(null,'',h); },30);
    }); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false); });
    window.addEventListener('resize',function(){ if(window.innerWidth>900) setMenu(false); });
  }
  // スマホ：画面の下の「相談する」などの帯（少し下に進んだら出す）
  var bar=document.querySelector('.sp-bar');
  if(bar) document.body.classList.add('has-bar');
  function onBar(){ if(bar) bar.classList.toggle('show', window.scrollY>360); }
  window.addEventListener('scroll',onBar,{passive:true}); onBar();

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
