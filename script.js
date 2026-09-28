/* Pad & Pixel: site concept, shared script (all pages). Load with <script src="script.js" defer>.
   - adds .js to <html>, so scroll-reveal only hides content when this script runs
   - header hairline once the page scrolls
   - mobile menu: toggles aria-expanded, closes on link click and on Escape (focus returns to the button)
   - .reveal blocks fade in on scroll; skipped entirely under prefers-reduced-motion */
(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');

  // header rule on scroll
  var header=d.querySelector('.site-header');
  if(header){
    var onScroll=function(){header.classList.toggle('is-scrolled', window.scrollY>8)};
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  // mobile menu
  var btn=d.querySelector('.menu-btn'), nav=d.getElementById('site-nav');
  if(btn && nav){
    var setMenu=function(open){
      btn.setAttribute('aria-expanded', open?'true':'false');
      nav.classList.toggle('is-open', open);
    };
    btn.addEventListener('click', function(){ setMenu(btn.getAttribute('aria-expanded')!=='true') });
    nav.addEventListener('click', function(e){ if(e.target.closest('a')) setMenu(false) });
    d.addEventListener('keydown', function(e){ if(e.key==='Escape' && nav.classList.contains('is-open')){ setMenu(false); btn.focus(); } });
  }

  // reveal on scroll (skipped for reduced motion)
  var items=d.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    items.forEach(function(el){el.classList.add('is-in')}); return;
  }
  var show=function(entries, obs){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('is-in'); obs.unobserve(en.target); } });
  };
  var io=new IntersectionObserver(show, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
  // very tall blocks could never reach 8% visibility on a short screen: reveal them on first contact
  var ioTall=new IntersectionObserver(show, {rootMargin:'0px 0px -8% 0px', threshold:0});
  items.forEach(function(el){ (el.offsetHeight*0.08 > window.innerHeight*0.5 ? ioTall : io).observe(el) });
})();
