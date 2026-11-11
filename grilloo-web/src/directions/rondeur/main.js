// Rondeur — interactions & motion (classic script).
(function () {
  'use strict';
  var G = window.GRILLOO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'expo.out';

  // ---------- header / ranges / drawer ----------
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var lastY = window.scrollY;
    var ranges = $('[data-ranges]'), rBtn = $('[data-ranges-toggle]');
    var drawer = $('[data-drawer]'), dBtn = $('[data-drawer-toggle]');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var busy = (rBtn && rBtn.getAttribute('aria-expanded') === 'true') || (drawer && !drawer.hidden);
      if (!busy) header.classList.toggle('is-hidden', y > lastY && y > 300);
      lastY = y;
    }, { passive: true });
    function setRanges(open) {
      if (!ranges) return;
      rBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      ranges.hidden = !open;
      if (open && G.gsap && !G.reduced) G.gsap.fromTo($$('a', ranges), { y: -16, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: EASE, stagger: 0.04 });
    }
    if (rBtn) {
      rBtn.addEventListener('click', function (e) { e.stopPropagation(); setRanges(rBtn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('click', function (e) { if (ranges && !ranges.contains(e.target)) setRanges(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setRanges(false); });
    }
    if (dBtn) dBtn.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      dBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (G.lenis) { if (open) G.lenis.stop(); else G.lenis.start(); }
    });
  }

  var pad2 = function (n) { return (n < 9 ? '0' : '') + (n + 1); };
  var finePointer = function () { return window.matchMedia && window.matchMedia('(pointer: fine)').matches; };

  // ---------- iris page transitions ----------
  // Leaving: a cyan drop then a white disc grows from the clicked point and the brand mark appears.
  // Arriving: layout.mjs (inline) starts the page covered when the previous page closed the iris;
  // here the disc retracts to the centre. bfcache restores reset everything.
  function irisOpen() {
    var html = document.documentElement, el = $('[data-iris]');
    if (!el || !html.classList.contains('r-iris-in')) return;
    el.classList.add('is-opening');
    requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.remove('r-iris-in'); }); });
    setTimeout(function () { el.classList.remove('is-opening'); }, 1300);
  }
  function iris() {
    var el = $('[data-iris]');
    if (!el || G.reduced) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target || a.hasAttribute('download') || /^(mailto|tel|https?|javascript):/i.test(href) || /\.pdf$/i.test(href)) return;
      var url = a.href;
      if (url.split('#')[0] === window.location.href.split('#')[0]) return;
      e.preventDefault();
      var x = e.clientX, y = e.clientY;
      if (!x && !y) { var r = a.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      el.style.setProperty('--x', x + 'px');
      el.style.setProperty('--y', y + 'px');
      el.classList.remove('is-opening');
      void el.offsetWidth;
      el.classList.add('is-closing');
      try { sessionStorage.setItem('r-iris', '1'); } catch (err) { /* private mode */ }
      setTimeout(function () { window.location.href = url; }, 720);
    });
    window.addEventListener('pageshow', function (ev) {
      if (!ev.persisted) return;
      document.documentElement.classList.remove('r-iris-in');
      el.style.transition = 'none';
      el.classList.remove('is-closing', 'is-opening');
      void el.offsetWidth;
      el.style.transition = '';
      try { sessionStorage.removeItem('r-iris'); } catch (err) { /* ignore */ }
    });
  }

  // ---------- magnetic buttons (no bounce: expo ease back to rest) ----------
  function magnetic() {
    if (!finePointer() || !G.gsap) return;
    $$('[data-magnetic], .r-round, .r-header__cta').forEach(function (b) {
      var txt = $('.r-btn__txt', b);
      var mx = G.gsap.quickTo(b, 'x', { duration: 0.6, ease: 'power3.out' });
      var my = G.gsap.quickTo(b, 'y', { duration: 0.6, ease: 'power3.out' });
      var tx = txt ? G.gsap.quickTo(txt, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
        mx(dx * 0.22); my(dy * 0.3);
        if (tx) tx(dx * 0.08);
      });
      b.addEventListener('pointerleave', function () {
        G.gsap.to(b, { x: 0, y: 0, duration: 1, ease: 'expo.out', overwrite: 'auto' });
        if (txt) G.gsap.to(txt, { x: 0, duration: 1, ease: 'expo.out', overwrite: 'auto' });
      });
    });
  }

  // ---------- portholes tilt toward the pointer ----------
  function tilt() {
    if (!finePointer() || !G.gsap) return;
    $$('[data-tilt], .r-card__disc, .r-alt__img, .r-pp__media .r-hub').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        G.gsap.to(el, { rotationY: nx * 10, rotationX: -ny * 10, transformPerspective: 900, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      });
      el.addEventListener('pointerleave', function () { G.gsap.to(el, { rotationY: 0, rotationX: 0, duration: 1.1, ease: 'expo.out', overwrite: 'auto' }); });
    });
  }

  // ---------- scroll ring / back to top ----------
  function topRing() {
    var b = $('[data-top]');
    if (!b) return;
    b.hidden = false;
    var val = $('[data-top-val]', b), ticking = false;
    function upd() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      val.style.setProperty('--off', String(1 - p));
      b.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.9);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    b.addEventListener('click', function () {
      if (G.lenis) G.lenis.scrollTo(0, { duration: 1.6 });
      else window.scrollTo({ top: 0, behavior: G.reduced ? 'auto' : 'smooth' });
      var skip = $('#main'); if (skip) { skip.setAttribute('tabindex', '-1'); skip.focus({ preventScroll: true }); }
    });
    upd();
  }

  // ---------- discs spin with scroll velocity ----------
  function spin(m) {
    var discs = $$('[data-spin]');
    var slow = $$('[data-spin-slow]');
    if (!discs.length && !slow.length) return;
    var angle = 0, vel = 0;
    if (m.lenis) m.lenis.on('scroll', function (e) { vel = e.velocity; });
    m.gsap.ticker.add(function () {
      angle += 0.06 + Math.min(Math.abs(vel), 60) * 0.12 * (vel < 0 ? -1 : 1);
      vel *= 0.9;
      discs.forEach(function (d) { d.style.setProperty('--spin', (d.classList.contains('r-head__ring') ? angle * 0.3 : angle) + 'deg'); });
      slow.forEach(function (d) { d.style.setProperty('--spin', (angle * 0.08) + 'deg'); });
    });
    $$('[data-float]').forEach(function (el) {
      if (el.closest('[data-hero]')) return;
      m.gsap.to(el, { yPercent: -62, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  // ---------- hero: entrance choreography, pointer depth, scroll exit ----------
  function hero(m) {
    var h = $('[data-hero]');
    if (!h) return;
    var gsap = m.gsap;
    var title = $('[data-hero-title]', h);
    var planet = $('[data-hero-planet]', h), zoom = $('[data-hero-zoom]', h), system = $('[data-hero-system]', h);
    var rings = $$('[data-hero-ring]', h);
    var words = null;
    if (m.SplitText && title) {
      var split = new m.SplitText(title, { type: 'words,lines', mask: 'lines', wordsClass: 'r-word' });
      words = split.words;
    }
    if (title) title.style.visibility = 'visible';
    var tl = G.heroTl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(planet, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', duration: 1.6, ease: 'power3.inOut' }, 0)
      .fromTo(zoom, { scale: 1.35 }, { scale: 1, duration: 2.8, ease: 'expo.out' }, 0.1)
      .fromTo(rings.filter(function (r) { return !r.classList.contains('is-dash'); }), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power3.inOut', stagger: 0.18 }, 0.25)
      .fromTo(rings.filter(function (r) { return r.classList.contains('is-dash'); }), { opacity: 0 }, { opacity: 0.55, duration: 1.4 }, 1)
      .fromTo($('.r-hero__meta', h), { opacity: 0, y: 14, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, clearProps: 'filter' }, 0.15);
    if (words) tl.from(words, { yPercent: 118, rotate: 6, duration: 1.25, stagger: 0.085 }, 0.3);
    tl.fromTo($$('.r-hero__lead, .r-hero__actions', h), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.75)
      .fromTo($$('[data-hpop]', h), { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 1.1, stagger: 0.09 }, 0.85)
      .fromTo($('.r-hero__scroll', h), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.9 }, 1.5);

    // scroll exit: text drifts up and fades, the system sinks and the planet image keeps zooming
    var st = { trigger: h, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to($('.r-hero__text', h), { yPercent: -16, autoAlpha: 0.15, ease: 'none', scrollTrigger: st });
    gsap.to(system, { yPercent: 10, ease: 'none', scrollTrigger: st });
    gsap.to($('.r-hero__moon', h), { yPercent: -28, ease: 'none', scrollTrigger: st });
    gsap.to($('.r-hero__halo', h), { scale: 1.12, ease: 'none', scrollTrigger: st });

    // pointer depth (fine pointers only)
    if (!finePointer()) return;
    var layers = $$('[data-depth]', h).map(function (el) {
      return { d: parseFloat(el.getAttribute('data-depth')) || 0, x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }) };
    });
    var rx = gsap.quickTo(system, 'rotationX', { duration: 1.2, ease: 'power3.out' });
    var ry = gsap.quickTo(system, 'rotationY', { duration: 1.2, ease: 'power3.out' });
    gsap.set(system, { transformPerspective: 1400 });
    h.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach(function (l) { l.x(nx * l.d * 2); l.y(ny * l.d * 2); });
      ry(nx * 7); rx(-ny * 7);
    });
    h.addEventListener('pointerleave', function () { layers.forEach(function (l) { l.x(0); l.y(0); }); rx(0); ry(0); });
  }

  // ---------- 05 Secteurs: pinned orbit ----------
  function orb(m) {
    var sec = $('[data-orb]');
    if (!sec || !m.gsap || !m.ScrollTrigger || !m.gsap.matchMedia) return;
    var mm = m.gsap.matchMedia();
    mm.add('(min-width: 1000px) and (min-height: 600px)', function () {
      var gsap = m.gsap;
      var items = $$('[data-orb-item]', sec), ports = items.map(function (it) { return $('[data-orb-port]', it); });
      var stage = $('[data-orb-stage]', sec), ring = $('[data-orb-ring]', sec), cur = $('[data-orb-cur]', sec);
      var n = items.length, STEP = 22, R = 800, active = -1, state = { p: 0 };
      sec.classList.add('is-orbit');
      function measure() { R = Math.max(window.innerWidth * 0.6, 640); stage.style.setProperty('--R', R + 'px'); }
      function render(p) {
        ports.forEach(function (el, i) {
          var d = i - p, ad = Math.abs(d), a = d * STEP * Math.PI / 180;
          var s = Math.max(0.4, 1 - ad * 0.22);
          var o = ad > 2.7 ? 0 : ad > 2 ? 1 - (ad - 2) / 0.7 : 1;
          el.style.transform = 'translate3d(' + (R * Math.sin(a)).toFixed(1) + 'px,' + (-R * Math.cos(a)).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
          el.style.opacity = o.toFixed(3);
          el.style.zIndex = String(10 - Math.round(ad));
          el.style.visibility = o === 0 ? 'hidden' : '';
        });
        ring.style.transform = 'rotate(' + (-p * STEP).toFixed(2) + 'deg)';
        var k = Math.max(0, Math.min(n - 1, Math.round(p)));
        if (k !== active) {
          active = k;
          items.forEach(function (it, i) { it.classList.toggle('is-active', i === k); });
          if (cur) cur.textContent = pad2(k);
        }
      }
      measure(); render(0);
      var tw = gsap.to(state, {
        p: n - 1, ease: 'none',
        scrollTrigger: {
          trigger: sec, pin: $('[data-orb-pin]', sec), start: 'top top', end: function () { return '+=' + Math.round((n - 1) * window.innerHeight * 0.6); },
          scrub: 0.7, snap: { snapTo: 1 / (n - 1), duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: 'power2.inOut' },
          onRefresh: function () { measure(); render(state.p); },
        },
        onUpdate: function () { render(state.p); },
      });
      function goTo(i, instant) {
        var stt = tw.scrollTrigger;
        var y = stt.start + (i / (n - 1)) * (stt.end - stt.start) + 1;
        if (G.lenis) G.lenis.scrollTo(y, instant ? { immediate: true } : { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
      }
      function onPort(e) {
        var i = ports.indexOf(e.currentTarget);
        if (i !== active) { e.preventDefault(); e.stopPropagation(); goTo(i); }
      }
      function onFocus(e) {
        var it = e.target.closest('[data-orb-item]');
        var i = items.indexOf(it);
        if (i > -1 && i !== active) goTo(i, true);
      }
      ports.forEach(function (p) { p.addEventListener('click', onPort, true); });
      sec.addEventListener('focusin', onFocus);
      return function () {
        ports.forEach(function (p) { p.removeEventListener('click', onPort, true); p.style.transform = ''; p.style.opacity = ''; p.style.zIndex = ''; p.style.visibility = ''; });
        sec.removeEventListener('focusin', onFocus);
        sec.classList.remove('is-orbit');
        ring.style.transform = '';
        items.forEach(function (it, i) { it.classList.toggle('is-active', i === 0); });
      };
    });
  }

  // ---------- 06 Engagements: the thread drawn by scrolling ----------
  function thread(m) {
    var sec = $('[data-thread]');
    if (!sec) return;
    var track = $('[data-thread-track]', sec), svg = $('[data-thread-svg]', sec);
    var base = $('[data-thread-base]', sec), line = $('[data-thread-line]', sec), bead = $('[data-thread-bead]', sec);
    var nodes = $$('[data-thread-node]', sec), dots = nodes.map(function (n) { return $('[data-thread-dot]', n); });
    var len = 0, marks = [], progress = 0;
    function build() {
      var tr = track.getBoundingClientRect();
      if (!tr.width) return;
      var pts = dots.map(function (d) { var r = d.getBoundingClientRect(); return { x: r.left - tr.left + r.width / 2, y: r.top - tr.top + r.height / 2 }; });
      svg.setAttribute('viewBox', '0 0 ' + tr.width.toFixed(1) + ' ' + tr.height.toFixed(1));
      var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], k = (b.y - a.y) * 0.62;
        d += ' C' + a.x.toFixed(1) + ' ' + (a.y + k).toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + (b.y - k).toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      }
      base.setAttribute('d', d); line.setAttribute('d', d);
      len = line.getTotalLength();
      line.style.strokeDasharray = len.toFixed(1);
      // path length at each node (nearest sample)
      var samples = [], N = 600;
      for (var s = 0; s <= N; s++) { var q = line.getPointAtLength(len * s / N); samples.push([q.x, q.y]); }
      marks = pts.map(function (pt) {
        var best = 0, bd = Infinity;
        samples.forEach(function (q, j) { var dd = (q[0] - pt.x) * (q[0] - pt.x) + (q[1] - pt.y) * (q[1] - pt.y); if (dd < bd) { bd = dd; best = j; } });
        return best / N;
      });
      paint(progress);
    }
    function paint(p) {
      if (!len) return;
      line.style.strokeDashoffset = (len * (1 - p)).toFixed(1);
      var pt = line.getPointAtLength(len * p);
      bead.style.transform = 'translate3d(' + pt.x.toFixed(1) + 'px,' + pt.y.toFixed(1) + 'px,0)';
      nodes.forEach(function (n, i) { n.classList.toggle('is-on', p >= marks[i] - 0.004); });
    }
    if (m.reduced || !m.gsap || !m.ScrollTrigger) {
      progress = 1; build();
      var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 150); });
      return;
    }
    sec.classList.add('is-live');
    build();
    var state = { p: 0 };
    m.gsap.to(state, { p: 1, ease: 'none', scrollTrigger: { trigger: track, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 }, onUpdate: function () { progress = state.p; paint(progress); } });
    m.ScrollTrigger.addEventListener('refresh', build);
  }

  // ---------- 07 Guide pierre: the polishing pad rolls and leaves a shine ----------
  function polish(m) {
    var sec = $('[data-polish]');
    if (!sec) return;
    var shine = $('[data-polish-shine]', sec), band = $('[data-polish-band]', sec), dull = $('[data-polish-dull]', sec), padEl = $('[data-polish-pad]', sec), spinEl = $('[data-polish-spin]', sec);
    var steps = $$('[data-polish-step]', sec);
    if (m.reduced || !m.gsap || !m.ScrollTrigger) { steps.forEach(function (s) { s.classList.add('is-on'); }); return; }
    sec.classList.add('is-live');
    function paint(p) {
      var w = band.offsetWidth, x = p * w, r = padEl.offsetWidth / 2 || 1;
      padEl.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
      shine.style.transform = 'translate3d(' + (x - r * 0.6).toFixed(1) + 'px,0,0)';
      shine.style.opacity = String(Math.min(1, p * 6) * Math.min(1, (1 - p) * 6));
      spinEl.style.transform = 'rotate(' + (x / r * 57.2958).toFixed(1) + 'deg)';
      dull.style.clipPath = 'inset(0 0 0 ' + (p * 100).toFixed(2) + '%)';
      steps.forEach(function (s, i) { s.classList.toggle('is-on', p >= (i + 0.3) / steps.length); });
    }
    var state = { p: 0 };
    paint(0);
    m.gsap.to(state, { p: 1, ease: 'none', scrollTrigger: { trigger: band, start: 'top 82%', end: 'top 22%', scrub: 0.8 }, onUpdate: function () { paint(state.p); } });
    m.ScrollTrigger.addEventListener('refresh', function () { paint(state.p); });
  }

  // ---------- reveals ----------
  function reveals(m) {
    var gsap = m.gsap;
    $$('[data-rise]').forEach(function (el) {
      if (!m.SplitText) { el.style.visibility = 'visible'; return; }
      var split = new m.SplitText(el, { type: 'words,lines', mask: 'lines' });
      el.style.visibility = 'visible';
      gsap.from(split.words, { yPercent: 110, rotate: 4, duration: 1.1, ease: EASE, stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    m.ScrollTrigger.batch('[data-pop]', {
      start: 'top 92%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, scale: 1, y: 0, duration: 1, ease: EASE, stagger: 0.06, overwrite: true }); },
    });
    $$('[data-chain]').forEach(function (c) {
      gsap.from(c.children, { scale: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
    });
    $$('[data-porthole]').forEach(function (sec) {
      var disc = $('[data-porthole-disc]', sec);
      gsap.fromTo(disc, { '--s': 0.25 }, { '--s': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'center center', scrub: true } });
    });
    $$('.r-portimg').forEach(function (fig) {
      gsap.fromTo(fig, { clipPath: 'inset(0% 30% 0% 30% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', ease: 'none', scrollTrigger: { trigger: fig, start: 'top 95%', end: 'center 55%', scrub: true } });
    });
    $$('.r-alt__img, .r-orb__disc').forEach(function (d) {
      if (d.closest('.is-orbit')) return;
      gsap.fromTo(d, { clipPath: 'circle(18% at 50% 50%)' }, { clipPath: 'circle(70.7% at 50% 50%)', duration: 1.4, ease: EASE, scrollTrigger: { trigger: d, start: 'top 88%', once: true } });
    });
    // orbit portholes pop in when the pinned stage arrives
    var orbSec = $('.r-orb.is-orbit');
    if (orbSec) gsap.from($$('.r-orb__disc', orbSec), { clipPath: 'circle(0% at 50% 50%)', duration: 1.3, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: orbSec, start: 'top 70%', once: true }, clearProps: 'clipPath' });
  }

  // ---------- circular carousel ----------
  function carousel() {
    var c = $('[data-carousel]');
    if (!c) return;
    var ring = $('[data-carousel-ring]', c);
    var thumbs = $$('[data-carousel-go]', c);
    var panels = $$('[data-carousel-panel]', c);
    var n = thumbs.length, cur = 0, turns = 0;
    c.classList.add('is-ready');
    function go(i) {
      var next = ((i % n) + n) % n;
      var delta = next - cur;
      if (delta > n / 2) delta -= n; else if (delta < -n / 2) delta += n;
      turns += delta; cur = next;
      var rot = -turns * 60;
      ring.style.transform = 'rotate(' + rot + 'deg)';
      ring.style.setProperty('--rot', rot + 'deg');
      thumbs.forEach(function (t, k) { t.setAttribute('aria-pressed', k === cur ? 'true' : 'false'); });
      panels.forEach(function (p, k) {
        var on = k === cur;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on && G.gsap && !G.reduced) G.gsap.fromTo(p.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE, stagger: 0.06 });
      });
    }
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    $('[data-carousel-prev]', c.parentNode).addEventListener('click', function () { go(cur - 1); });
    $('[data-carousel-next]', c.parentNode).addEventListener('click', function () { go(cur + 1); });
    c.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); } });
    go(0);
  }

  // ---------- dial teaser ----------
  function dial() {
    var f = $('[data-teaser]');
    if (!f || !G.recommend) return;
    var products = G.readJson('catalogue-data') || [];
    var arc = $('[data-dial-arc]', f);
    function run() {
      var v = Number(f.elements.area.value);
      var r = G.recommend(products, { surfaceType: 'dur', area: v, hours: 1, limit: Infinity });
      var k = Number.isFinite(v) && v > 0 ? Math.min(1, v / 12000) : 0;
      arc.style.setProperty('--off', String(578 * (1 - k)));
      $('[data-teaser-needed]', f).textContent = r.needed === null ? '—' : r.needed.toLocaleString('fr-FR');
      $('[data-teaser-count]', f).textContent = r.needed === null ? '—' : String(r.items.length);
    }
    f.elements.area.addEventListener('input', run);
    run();
  }

  // ---------- product gallery ----------
  function gallery() {
    $$('[data-gallery]').forEach(function (g) {
      var img = $('.r-hub__img', g);
      $$('[data-gallery-src]', g).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-gallery-src]', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          img.style.opacity = '0';
          setTimeout(function () { img.src = b.getAttribute('data-gallery-src'); img.style.opacity = '1'; }, 250);
        });
      });
    });
  }

  // ---------- client templates ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var FIGS = [['productivity', 'm²/h'], ['width', 'mm'], ['tank', 'L'], ['autonomy', 'h'], ['power', 'W'], ['weight', 'kg']];
  G.renderCard = function (p) {
    var f = FIGS.filter(function (x) { return typeof (p.key || {})[x[0]] === 'number'; }).slice(0, 3);
    return '<article class="r-card"><a href="' + esc(p.href) + '" class="r-card__media" tabindex="-1" aria-hidden="true"><span class="r-card__disc"><img class="r-card__img" src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async"></span></a>' +
      '<p class="r-card__kind">' + esc(p.kind) + '</p><h3 class="r-card__name"><a href="' + esc(p.href) + '">' + esc(p.name) + '</a></h3>' +
      (f.length ? '<ul class="r-card__figs">' + f.map(function (x) { return '<li><b>' + p.key[x[0]].toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + '</b> ' + x[1] + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="r-card__actions"><a class="r-link" href="' + esc(p.href) + '">Fiche</a><button class="r-cmp" type="button" data-compare-add="' + esc(p.slug) + '" aria-pressed="false" aria-label="Comparer ' + esc(p.name) + '"><svg class="r-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div></article>';
  };
  G.renderCompare = function (list) {
    var rows = G.compareRows(list);
    return '<div class="r-compare"><table><thead><tr><th></th>' + list.map(function (p) { return '<th><img src="' + esc(p.img) + '" alt=""><a href="' + esc(p.href) + '">' + esc(p.name) + '</a></th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th>' + r.slice(2).map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };
  function popCards(list, container) {
    if (!G.gsap || G.reduced || !container) return;
    G.gsap.fromTo(container.children, { opacity: 0, scale: 0.9, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.03, overwrite: true });
  }

  // ---------- boot ----------
  var m = G.initMotion ? G.initMotion({ lerp: 0.085 }) : { reduced: true };
  G.gsap = m.gsap; G.reduced = m.reduced; G.lenis = m.lenis;
  irisOpen();
  initHeader();
  carousel();
  dial();
  gallery();
  topRing();
  if (G.initCompare) G.initCompare({ renderTable: G.renderCompare });
  if (G.initCatalogue) G.initCatalogue({ renderCard: G.renderCard, onRender: popCards, emptyHtml: '<p class="r-empty">Aucune machine ne correspond à ces critères.</p>' });
  var tpl = $('[data-guide-empty]');
  if (G.initGuide) G.initGuide({ renderItem: G.renderCard, emptyHtml: tpl ? tpl.innerHTML : '', onRender: function () { popCards(null, $('[data-guide-results]')); } });
  if (G.initContact) G.initContact();
  if (!m.reduced && m.gsap) {
    try {
      iris();
      magnetic();
      tilt();
      spin(m);
      hero(m);
      orb(m);
      thread(m);
      polish(m);
      reveals(m);
      if (G.ambient) G.ambient(m);
      window.addEventListener('load', function () { m.ScrollTrigger.refresh(); });
    } catch (err) {
      document.documentElement.classList.remove('js-motion');
      if (window.console) console.error(err);
    }
  } else {
    thread(m);
    polish(m);
  }
})();
