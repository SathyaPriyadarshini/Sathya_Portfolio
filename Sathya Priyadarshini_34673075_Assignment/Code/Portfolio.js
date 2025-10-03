(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HEADER_OFFSET = 72; // keep in sync with CSS --header-h / scroll-margin-top
  const $  = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const scrollToEl = (el) => {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

 
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    scrollToEl(target);

    if ($('#mainNav')?.classList.contains('is-open')) setNav(false);

  
    $$('.main-nav a').forEach(x => x.classList.remove('active'));
    document.querySelector(`.main-nav a[href="${id}"]`)?.classList.add('active');
  });

  
  $('#introNext')?.addEventListener('click', () => scrollToEl($('#hero')));

  $('#scrollHero')?.addEventListener('click', () => {
    const target = document.querySelector('#about') || document.querySelector('#hero')?.nextElementSibling;
    if (target) scrollToEl(target);
  });

  $('#scrollDown')?.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) scrollToEl(about);
  });

  $('.scroll-btn')?.addEventListener('click', () => scrollToEl($('#hero')));

  
  const header = $('.site-header');
  const onScrollHeader = () => header?.classList.toggle('is-stuck', window.scrollY > 6);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  const toggle  = $('#navToggle');
  const nav     = $('#mainNav');
  const overlay = $('#navOverlay');

  function setNav(open){
    nav?.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (overlay){
      overlay.hidden = !open;
      overlay.classList.toggle('is-on', open);
    }
  }

  toggle?.addEventListener('click', () => setNav(!nav?.classList.contains('is-open')));
  overlay?.addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });


  window.matchMedia('(min-width: 721px)').addEventListener('change', (ev) => { if (ev.matches) setNav(false); });

  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('is-open')) return;
    const insideMenu  = e.target.closest('#mainNav');
    const onToggleBtn = e.target.closest('#navToggle');
    if (!insideMenu && !onToggleBtn) setNav(false);
  });


  window.addEventListener('scroll', () => {
    if (nav?.classList.contains('is-open')) setNav(false);
  }, { passive:true });

  
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    $$('[data-animate]').forEach(el => io.observe(el));
  } else {
    $$('[data-animate]').forEach(el => el.classList.add('in-view'));
  }


  (() => {
    const track  = $('#toolsTrack');
    const slider = track?.closest('.tools__slider');
    if (!track || !slider || track.dataset.cloned === 'true') return;

    track.innerHTML += track.innerHTML; 
    track.dataset.cloned = 'true';

    while (track.scrollWidth < slider.clientWidth * 2.1) {
      track.innerHTML += track.innerHTML;
    }


    if (matchMedia('(pointer:fine)').matches) {
      slider.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
      slider.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
  })();

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  
  (function(){
    const title = document.getElementById('popTitle');
    if(!title) return;

    title.querySelectorAll('.highlight').forEach(span => {
      const text = span.textContent.trim();
      span.textContent = '';
      [...text].forEach((char, i) => {
        const ch = document.createElement('span');
        ch.className = 'ch';
        ch.style.setProperty('--i', i);
        ch.textContent = char;
        span.appendChild(ch);
      });
    });


    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          title.classList.add('in-view');     // play in
        } else {
          title.classList.remove('in-view');  // reset to replay on return
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -10% 0px' });

    io.observe(title);
  })();

  
  (function(){
    const name = document.getElementById('name');
    if(!name) return;
    const text = name.textContent.trim();
    name.textContent = "";
    [...text].forEach((ch,i)=>{
      const span = document.createElement("span");
      span.className = "letter";
      span.style.setProperty("--i", i);
      span.textContent = ch;
      name.appendChild(span);
    });
  })();
})();

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const id = a.getAttribute('href');
  if (!id || id === '#') return;

  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // only highlight nav items if the click was in the main nav
  if (a.closest('.main-nav')) {
    document.querySelectorAll('.main-nav a').forEach(x => x.classList.remove('active'));
    document.querySelector(`.main-nav a[href="${id}"]`)?.classList.add('active');
  }

  // close mobile nav if open
  if (typeof closeNav === 'function' && document.getElementById('mainNav')?.classList.contains('is-open')) {
    closeNav();
  }
});