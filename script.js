(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const body = document.body;
  body.classList.add('loading');

  /* ---------- Preloader ---------- */
  const loader = $('#loader'), num = $('#loaderNum'), bar = $('#loaderBar');
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    num.textContent = n; bar.style.width = n + '%';
    if (n >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('done');
        body.classList.remove('loading');
        body.classList.add('loaded');
      }, 300);
    }
  }, 45);

  /* ---------- Cursor ---------- */
  const cursor = $('#cursor'), label = $('#cursorLabel');
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
  $$('[data-hover], a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const t = el.dataset.cursor;
      if (t) { label.textContent = t; cursor.classList.add('label'); }
      else cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover', 'label'));
  });

  /* ---------- Magnetic ---------- */
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* ---------- Nav ---------- */
  const nav = $('#nav'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 400 && !body.classList.contains('menu-open'));
    lastY = y;
  }, { passive: true });
  $('#burger').addEventListener('click', () => body.classList.toggle('menu-open'));
  $$('.menu a').forEach(a => a.addEventListener('click', () => body.classList.remove('menu-open')));

  /* ---------- Hero rotator ---------- */
  const words = $$('#rotator b'); let ri = 0;
  words[0].classList.add('on');
  setInterval(() => {
    const cur = words[ri]; cur.classList.remove('on'); cur.classList.add('out');
    setTimeout(() => cur.classList.remove('out'), 700);
    ri = (ri + 1) % words.length; words[ri].classList.add('on');
  }, 2200);

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Manifesto word lighting ---------- */
  const man = $('#manifesto');
  const highlights = ['photography,', 'film', 'publishing', 'bold', 'voice'];
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w =>
    `<span class="word${highlights.includes(w.toLowerCase()) ? ' hl' : ''}">${w}</span>`).join(' ');
  const mWords = $$('.word', man);
  const lightUp = () => {
    const r = man.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const lit = Math.floor(p * mWords.length);
    mWords.forEach((w, i) => w.classList.toggle('lit', i < lit));
  };
  addEventListener('scroll', lightUp, { passive: true }); lightUp();

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 1600), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * eased);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step); cio.unobserve(el);
  }), { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Horizontal work scroll (GSAP) ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 821px)', () => {
      const track = $('#workTrack'), pin = $('.work__pin');
      const dist = () => track.scrollWidth - (pin.clientWidth - track.offsetLeft) + 60;
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist(), pin: pin, scrub: 1, invalidateOnRefresh: true }
      });
    });
    // subtle parallax on hero blobs
    gsap.to('.hero .blobs', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  $('#year').textContent = new Date().getFullYear();
})();
