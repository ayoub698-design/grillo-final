// Trace — interactions & motion (classic script).
(function () {
  'use strict';
  var G = window.GRILLOO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'power3.out';
  var MAX_W = 2100;

  // ---------- header ----------
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var lastY = window.scrollY;
    var ranges = $('[data-ranges]'), rBtn = $('[data-ranges-toggle]');
    var drawer = $('[data-drawer]'), dBtn = $('[data-drawer-toggle]');
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      var busy = (rBtn && rBtn.getAttribute('aria-expanded') === 'true') || (drawer && !drawer.hidden);
      if (!busy) header.classList.toggle('is-hidden', y > lastY && y > 320);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    function setRanges(open) {
      if (!ranges) return;
      rBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      ranges.hidden = !open;
      if (open && G.gsap && !G.reduced) G.gsap.fromTo(ranges, { opacity: 0, y: -8, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: EASE });
    }
    if (rBtn) {
      rBtn.addEventListener('click', function () { setRanges(rBtn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('click', function (e) { if (!rBtn.parentNode.contains(e.target)) setRanges(false); });
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

  // ---------- hero: dust haze wiped by a squeegee cursor ----------
  function haze() {
    var canvas = $('[data-haze]');
    if (!canvas || G.reduced) return;
    var hero = canvas.closest('[data-hero]');
    var stage = canvas.parentNode;
    var robot = $('[data-robot]', hero);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, layer = null, visible = true, last = null, lastT = 0;

    // Dust haze on the floor only: fades in below the horizon (CSS var --horizon on the stage, 0–1).
    function buildLayer() {
      var horizon = parseFloat(getComputedStyle(stage).getPropertyValue('--horizon')) || 0.5;
      layer = document.createElement('canvas');
      layer.width = W; layer.height = H;
      var l = layer.getContext('2d');
      l.fillStyle = 'rgba(232, 230, 223, 0.84)';
      l.fillRect(0, 0, W, H);
      for (var i = 0; i < 26; i++) {
        var x = Math.random() * W, y = (horizon + Math.random() * (1 - horizon)) * H, r = (0.08 + Math.random() * 0.2) * Math.max(W, H);
        var g = l.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(200, 196, 186, ' + (0.14 + Math.random() * 0.16) + ')');
        g.addColorStop(1, 'rgba(200, 196, 186, 0)');
        l.fillStyle = g; l.fillRect(x - r, y - r, r * 2, r * 2);
      }
      l.lineCap = 'round';
      for (var s = 0; s < 16; s++) {
        l.strokeStyle = 'rgba(170, 164, 152, ' + (0.04 + Math.random() * 0.06) + ')';
        l.lineWidth = (2 + Math.random() * 7) * dpr;
        var sx = Math.random() * W, sy = (horizon + 0.1 + Math.random() * (0.9 - horizon)) * H, len = (60 + Math.random() * 220) * dpr, a = Math.random() * Math.PI;
        l.beginPath(); l.moveTo(sx, sy); l.quadraticCurveTo(sx + Math.cos(a) * len * 0.5 + 20, sy + Math.sin(a) * len * 0.5 - 20, sx + Math.cos(a) * len, sy + Math.sin(a) * len); l.stroke();
      }
      var n = document.createElement('canvas'); n.width = n.height = 160;
      var nc = n.getContext('2d'), img = nc.createImageData(160, 160);
      for (var p = 0; p < img.data.length; p += 4) { var v = 150 + Math.random() * 80; img.data[p] = img.data[p + 1] = img.data[p + 2] = v; img.data[p + 3] = Math.random() < 0.5 ? Math.random() * 34 : 0; }
      nc.putImageData(img, 0, 0);
      l.fillStyle = l.createPattern(n, 'repeat'); l.fillRect(0, 0, W, H);
      // keep the haze on the floor plane only
      l.globalCompositeOperation = 'destination-in';
      var mask = l.createLinearGradient(0, horizon * H, 0, (horizon + 0.16) * H);
      mask.addColorStop(0, 'rgba(0,0,0,0)');
      mask.addColorStop(1, 'rgba(0,0,0,1)');
      l.fillStyle = mask; l.fillRect(0, 0, W, H);
      l.globalCompositeOperation = 'source-over';
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
      canvas.width = W; canvas.height = H;
      buildLayer();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(layer, 0, 0);
    }

    // Erase a curved squeegee blade perpendicular to the motion, between two points.
    function wipe(x0, y0, x1, y1, L) {
      var dx = x1 - x0, dy = y1 - y0, dist = Math.hypot(dx, dy);
      if (dist < 0.5) return;
      var ux = dx / dist, uy = dy / dist, nx = -uy, ny = ux;
      L = L || Math.min(Math.max(W * 0.11, 150 * dpr), 300 * dpr);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,0.92)';
      ctx.lineWidth = 12 * dpr;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 14 * dpr;
      var steps = Math.ceil(dist / (5 * dpr));
      for (var i = 0; i <= steps; i++) {
        var t = i / steps, cx = x0 + dx * t, cy = y0 + dy * t, bow = 0.12 * L;
        ctx.beginPath();
        ctx.moveTo(cx - nx * L / 2, cy - ny * L / 2);
        ctx.quadraticCurveTo(cx + ux * bow, cy + uy * bow, cx + nx * L / 2, cy + ny * L / 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    }

    function loop(t) {
      requestAnimationFrame(loop);
      if (!visible || t - lastT < 33) return;
      lastT = t;
      ctx.globalAlpha = 0.008; // haze settles back slowly
      ctx.drawImage(layer, 0, 0);
      ctx.globalAlpha = 1;
    }

    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr }; }
    hero.addEventListener('pointermove', function (e) {
      var p = pos(e);
      if (last) wipe(last.x, last.y, p.x, p.y);
      last = p;
    });
    hero.addEventListener('pointerleave', function () { last = null; });

    resize();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
    requestAnimationFrame(loop);

    // The RoboClean drives in from the right and leaves a clean, glossy band behind it.
    if (robot && G.gsap) {
      var prev = null;
      var base = function () {
        var c = canvas.getBoundingClientRect(), r = robot.getBoundingClientRect();
        return { x: (r.left + r.width * 0.42 - c.left) * dpr, y: (r.top + r.height * 0.9 - c.top) * dpr, L: r.height * 0.62 * dpr };
      };
      G.gsap.from(robot, {
        x: function () { return stage.getBoundingClientRect().width * 0.6; },
        duration: 3.4, delay: 0.55, ease: 'power3.out',
        onUpdate: function () { var b = base(); if (prev) wipe(prev.x, prev.y, b.x, b.y, b.L); prev = b; },
      });
    }
  }

// ---------- reveals ----------
  function reveals(m) {
    var gsap = m.gsap, ST = m.ScrollTrigger;
    $$('[data-dry]').forEach(function (el) {
      if (!m.SplitText) { el.style.visibility = 'visible'; return; }
      var split = new m.SplitText(el, { type: 'words', wordsClass: 't-dry-line' });
      el.style.visibility = 'visible';
      gsap.from(split.words, { opacity: 0, filter: 'blur(14px)', y: 18, duration: 1.4, ease: EASE, stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    ST.batch('[data-fog]', {
      start: 'top 90%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.3, ease: EASE, stagger: 0.09, overwrite: true }); },
    });
    ST.batch('[data-band-w]', {
      start: 'top 95%', once: true,
      onEnter: function (els) { gsap.to(els.map(function (e) { return $('.t-band__bar', e); }), { scaleX: 1, duration: 1.5, ease: 'power2.inOut', stagger: 0.03 }); },
    });
    $$('[data-trail]').forEach(function (el) {
      gsap.fromTo(el, { '--tx': '-25%', '--op': 1 }, { '--tx': '25%', '--op': 0.25, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('[data-pass]').forEach(function (el, i) {
      gsap.from($('.t-pass__in', el), { x: i % 2 ? 60 : -60, opacity: 0, duration: 1.4, ease: EASE, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  }

  var mq = function (q) { return !!(window.matchMedia && window.matchMedia(q).matches); };
  var FINE = function () { return mq('(hover: hover) and (pointer: fine)'); };

  // ---------- hero: entrance choreography + scroll-out ----------
  function heroIntro(m) {
    var hero = $('[data-hero]');
    if (!hero) return;
    var gsap = m.gsap;
    var bg = $('[data-hero-bg]', hero), title = $('[data-hero-title]', hero), mirror = $('.t-hero__mirror', hero);
    var tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'expo.out' } });
    tl.fromTo(bg, { scale: 1.16, opacity: 0, filter: 'blur(16px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.6, clearProps: 'filter' }, 0);
    if (title && m.SplitText) {
      var split = new m.SplitText(title, { type: 'lines,words,chars', mask: 'lines', linesClass: 't-hl', charsClass: 't-hc' });
      title.style.visibility = 'visible';
      tl.from(split.chars, { yPercent: 115, opacity: 0, filter: 'blur(12px)', duration: 1.6, stagger: 0.035 }, 0.45);
    } else if (title) {
      title.style.visibility = 'visible';
      tl.from(title, { opacity: 0, y: 30, filter: 'blur(12px)', duration: 1.6 }, 0.45);
    }
    if (mirror) tl.fromTo(mirror, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 2.2, ease: 'power3.out' }, 1.1);
    tl.fromTo($$('[data-hero-in]', hero), { opacity: 0, y: 20, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, stagger: 0.12, clearProps: 'filter,transform' }, 1.15);
    var calls = $$('[data-callout]', hero);
    if (calls.length) {
      tl.fromTo(calls, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 1.2, stagger: 0.18 }, 3.0);
      tl.fromTo(calls.map(function (c) { return $('i', c); }), { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.18, ease: 'power3.inOut' }, 2.9);
    }
    // scroll-out: the title rises and thins out, the floor keeps approaching
    var st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to($('[data-hero-top]', hero), { yPercent: -22, opacity: 0.15, ease: 'none', scrollTrigger: st });
    if (mirror) gsap.to(mirror, { yPercent: 18, ease: 'none', scrollTrigger: st });
    var pic = $('picture', bg);
    if (pic) gsap.to(pic, { scale: 1.08, yPercent: 3, ease: 'none', scrollTrigger: st });
  }

  // ---------- hero: squeegee cursor (fine pointers) ----------
  function heroBlade(m) {
    var stage = $('[data-hero-stage]'), cur = $('[data-hero-cursor]');
    if (!stage || !cur || !FINE()) return;
    stage.classList.add('has-blade');
    var gsap = m.gsap;
    var xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3.out' });
    var yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3.out' });
    var rot = 0, lx = null, ly = null;
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (lx !== null) {
        var dx = x - lx, dy = y - ly;
        if (dx * dx + dy * dy > 16) {
          var a = Math.atan2(dy, dx) * 180 / Math.PI;
          rot += ((a - rot + 540) % 360) - 180;
          gsap.to(cur, { rotation: rot, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          lx = x; ly = y;
        }
      } else { lx = x; ly = y; }
      xTo(x); yTo(y);
      cur.classList.add('is-on');
    });
    stage.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); lx = ly = null; });
  }

  // ---------- secteurs: list + sticky window ----------
  function sectorsUI(m) {
    var sec = $('[data-secs]');
    if (!sec) return;
    var items = $$('[data-sec]', sec), slides = $$('[data-sec-slide]', sec), ticks = $$('[data-sec-tick]', sec);
    var wet = $('[data-secs-wet]', sec), win = $('[data-secs-win]', sec), list = $('.t-secs__list', sec);
    var cur = 0;
    function moveWet() {
      var li = items[cur];
      if (!wet || !li) return;
      wet.style.height = li.offsetHeight + 'px';
      wet.style.transform = 'translateY(' + (li.offsetTop + list.offsetTop) + 'px)';
    }
    function set(i) {
      if (i === cur || !slides[i]) return;
      var dir = i > cur ? 'fwd' : 'back', prev = cur;
      cur = i;
      items.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
      ticks.forEach(function (t, k) { t.classList.toggle('is-on', k === i); });
      slides.forEach(function (s, k) { s.classList.remove('is-active', 'was-active', 'fwd', 'back'); if (k === prev) s.classList.add('was-active'); });
      var s = slides[i];
      s.classList.add(dir);
      void s.offsetWidth; // commit the "from" edge before sweeping
      s.classList.add('is-active');
      moveWet();
    }
    items.forEach(function (li, i) {
      var a = $('a', li);
      a.addEventListener('mouseenter', function () { set(i); });
      a.addEventListener('focus', function () { set(i); });
      if (m && m.ScrollTrigger && !m.reduced && mq('(min-width: 901px)')) {
        m.ScrollTrigger.create({ trigger: li, start: 'top 58%', end: 'bottom 58%', onToggle: function (self) { if (self.isActive) set(i); } });
      }
    });
    if (win) win.addEventListener('click', function () { var a = $('a', items[cur]); if (a) a.click(); });
    moveWet();
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(moveWet, 150); });
    window.addEventListener('load', moveWet);
  }

  // ---------- engagements: the wet trail ----------
  function valuesTrail(m) {
    var sec = $('[data-vals]');
    if (!sec) return;
    var items = $$('[data-val]', sec);
    var horizontal = mq('(min-width: 901px)') && window.innerHeight >= 640;
    if (!horizontal) {
      items.forEach(function (li) { m.ScrollTrigger.create({ trigger: li, start: 'top 82%', once: true, onEnter: function () { li.classList.add('is-wet'); } }); });
      return;
    }
    sec.classList.add('is-h');
    var track = $('[data-vals-track]', sec), pin = $('[data-vals-pin]', sec), wet = $('[data-vals-wet]', sec), rail = $('[data-vals-rail]', sec);
    var drops = items.map(function (li) { return $('.t-val__drop', li); });
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tween;
    function update() {
      var prog = tween ? tween.progress() : 0;
      var front = window.innerWidth * (0.6 + 0.36 * prog);
      var r = rail.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (front - r.left) / r.width));
      wet.style.clipPath = 'inset(0 ' + ((1 - p) * 100).toFixed(2) + '% 0 0)';
      items.forEach(function (li, k) { li.classList.toggle('is-wet', drops[k].getBoundingClientRect().left < front); });
    }
    tween = m.gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none', onUpdate: update,
      scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.8, pin: true, invalidateOnRefresh: true, onRefresh: update },
    });
    update();
  }

  // ---------- guide pierre: seven passes, matte → mirror ----------
  function stoneUI(m) {
    var sec = $('[data-stone]');
    if (!sec) return;
    var floor = $('[data-stone-floor]', sec), steps = $$('[data-stone-step]', sec), ticks = $$('[data-stone-tick]', sec), pin = $('[data-stone-pin]', sec);
    var n = steps.length, cur = -1, P0 = 10, P1 = 112;
    function setStep(i) {
      if (i === cur) return;
      cur = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.classList.toggle('is-past', k < i); });
      ticks.forEach(function (t, k) { t.classList.toggle('is-on', k <= i); });
    }
    var pinned = mq('(min-width: 901px)') && window.innerHeight >= 700;
    if (pinned) {
      sec.classList.add('is-pinned');
      setStep(0);
      var st = { p: 0 };
      floor.style.setProperty('--p', P0 + '%');
      m.gsap.to(st, {
        p: 1, ease: 'none',
        onUpdate: function () {
          floor.style.setProperty('--p', (P0 + (P1 - P0) * st.p).toFixed(2) + '%');
          setStep(Math.min(n - 1, Math.floor(st.p * n)));
          floor.classList.toggle('is-done', st.p > 0.93);
        },
        scrollTrigger: { trigger: pin, start: 'top top', end: function () { return '+=' + Math.round(window.innerHeight * 2.6); }, scrub: 0.9, pin: true, invalidateOnRefresh: true },
      });
    } else {
      m.gsap.fromTo(floor, { '--p': P0 + '%' }, { '--p': P1 + '%', ease: 'none', scrollTrigger: { trigger: floor, start: 'top 85%', end: 'bottom 20%', scrub: 0.8 } });
    }
  }

  // ---------- page transitions: a white squeegee sweep ----------
  function veil(m) {
    var v = $('[data-veil]');
    if (!v) return;
    var gsap = m.gsap, panel = $('.t-veil__panel', v), mark = $('.t-veil__mark', v), leaving = false;
    v.classList.add('is-live');
    gsap.set(panel, { xPercent: 0 });
    gsap.to(panel, { xPercent: 101, duration: 1.15, ease: 'power3.inOut', delay: 0.05, onComplete: function () { v.style.visibility = 'hidden'; } });
    document.addEventListener('click', function (e) {
      if (leaving || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' || (a.target && a.target !== '_self') || a.hasAttribute('download') || /^[a-z][a-z0-9+.-]*:/i.test(href) || !/\.html(?:[?#]|$)/.test(href)) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      e.preventDefault();
      leaving = true;
      var done = false, go = function () { if (done) return; done = true; location.href = a.href; };
      v.style.visibility = 'visible';
      gsap.fromTo(panel, { xPercent: -101 }, { xPercent: 0, duration: 0.8, ease: 'power3.inOut', onComplete: go });
      gsap.fromTo(mark, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.4, ease: EASE });
      setTimeout(go, 1500);
    });
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      leaving = false;
      gsap.killTweensOf([panel, mark]);
      gsap.set(panel, { xPercent: 101 });
      gsap.set(mark, { opacity: 0 });
      v.style.visibility = 'hidden';
    });
  }

  // ---------- reading progress ----------
  function progress(m) {
    var bar = $('[data-progress]');
    if (!bar) return;
    m.gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.3 } });
  }

  // ---------- reactive surfaces: cursor reflection + soft tilt ----------
  var SHEEN = '.t-floor, .t-strip__f, .t-photo, [data-sheen]';
  var TILT = '.t-card .t-floor, .t-floor--big';
  function surfaces(m) {
    if (!FINE()) return;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest(SHEEN);
      if (!el) return;
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      if (m && m.gsap && !m.reduced && el.matches(TILT)) {
        m.gsap.to(el, { rotationY: (px - 0.5) * 7, rotationX: -(py - 0.5) * 6, transformPerspective: 1000, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
        if (!el._tilt) {
          el._tilt = true;
          el.addEventListener('pointerleave', function () { m.gsap.to(el, { rotationY: 0, rotationX: 0, duration: 1.1, ease: 'power3.out', overwrite: 'auto' }); });
        }
      }
    }, { passive: true });
  }

  // ---------- buttons: magnetic pull + water ring on press ----------
  function buttons(m) {
    var gsap = m.gsap;
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.t-btn, .t-pill');
      if (!b) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = document.createElement('span');
      s.className = 't-ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px';
      s.style.top = (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
      setTimeout(function () { if (s.parentNode) s.remove(); }, 1600);
    });
    if (!FINE()) return;
    $$('.t-btn, .t-header .t-pill, .t-hero__scroll').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: 0.7, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: 0.7, ease: 'power3.out' });
      var t = $('.t-btn__txt', b), tx = t ? gsap.quickTo(t, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
        xTo(dx * 0.16); yTo(dy * 0.28); if (tx) tx(dx * 0.05);
      });
      b.addEventListener('pointerleave', function () { xTo(0); yTo(0); if (tx) tx(0); });
    });
  }

  // ---------- before / after ----------
  function beforeAfter() {
    $$('[data-ba]').forEach(function (ba) {
      var r = $('[data-ba-range]', ba);
      var set = function () { ba.style.setProperty('--pos', r.value + '%'); };
      r.addEventListener('input', set); set();
    });
  }

  // ---------- width filter ----------
  function widthFilter() {
    var btns = $$('[data-wfilter]');
    if (!btns.length) return;
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-wfilter');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); x.classList.toggle('t-pill--ink', x === b); });
        $$('[data-wrow]').forEach(function (row) { row.hidden = !!v && row.getAttribute('data-wrow') !== v; });
        if (G.ScrollTrigger) G.ScrollTrigger.refresh();
      });
    });
  }

  // ---------- teaser slider ----------
  function teaser() {
    var f = $('[data-teaser]');
    if (!f || !G.recommend) return;
    var products = G.readJson('catalogue-data') || [];
    var range = f.elements.area;
    function run() {
      var v = Number(range.value);
      range.style.setProperty('--p', ((v - range.min) / (range.max - range.min) * 100) + '%');
      var r = G.recommend(products, { surfaceType: 'dur', area: v, hours: 1, limit: Infinity });
      $('[data-teaser-area]', f).textContent = v.toLocaleString('fr-FR');
      $('[data-teaser-needed]', f).textContent = r.needed === null ? '—' : r.needed.toLocaleString('fr-FR');
      $('[data-teaser-count]', f).textContent = String(r.items.length);
    }
    range.addEventListener('input', run);
    run();
  }

  // ---------- product gallery ----------
  function gallery() {
    $$('[data-gallery]').forEach(function (g) {
      var imgs = $$('.t-floor__img, .t-floor__refl', g);
      $$('[data-gallery-src]', g).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('[data-gallery-src]', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          imgs.forEach(function (i) { i.style.opacity = '0'; });
          setTimeout(function () { imgs.forEach(function (i) { i.src = b.getAttribute('data-gallery-src'); i.style.opacity = ''; }); }, 300);
        });
      });
    });
  }

  // ---------- client templates ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var FIGS = [['productivity', 'Rendement', 'm²/h'], ['width', 'Largeur', 'mm'], ['tank', 'Réservoir', 'L'], ['autonomy', 'Autonomie', 'h'], ['power', 'Puissance', 'W'], ['weight', 'Poids', 'kg']];
  function figs(p, max) {
    return FIGS.filter(function (f) { return typeof (p.key || {})[f[0]] === 'number' && f[0] !== 'width'; }).slice(0, max).map(function (f) {
      var TANK = { aspirateurs: 'Cuve', balayeuses: 'Bac à déchets', 'textiles-sechage': 'Réservoir' };
      return { label: f[0] === 'tank' ? (TANK[p.gamme] || f[1]) : f[1], value: p.key[f[0]].toLocaleString('fr-FR', { maximumFractionDigits: 1 }), unit: f[2] };
    });
  }
  function band(w) {
    if (typeof w !== 'number') return '';
    var pct = Math.max(6, Math.round(w / MAX_W * 1000) / 10);
    return '<div class="t-band" style="--w:' + pct + '%"><span class="t-band__label">' + w.toLocaleString('fr-FR') + ' mm</span><span class="t-band__bar"></span></div>';
  }
  G.renderCard = function (p) {
    var f = figs(p, 3);
    return '<article class="t-card"><a href="' + esc(p.href) + '" class="t-card__media" tabindex="-1" aria-hidden="true"><div class="t-floor"><div class="t-floor__obj"><img class="t-floor__img" src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async"><img class="t-floor__refl" src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async"></div></div></a>' +
      '<div class="t-card__body"><p class="t-mono t-card__kind">' + esc(p.kind) + '</p><h3 class="t-card__name"><a href="' + esc(p.href) + '">' + esc(p.name) + '</a></h3>' + band(p.key && p.key.width) +
      (f.length ? '<ul class="t-card__figs">' + f.map(function (x) { return '<li><span class="t-mono">' + esc(x.label) + '</span><b>' + esc(x.value) + '</b> <small>' + esc(x.unit) + '</small></li>'; }).join('') + '</ul>' : '') +
      '<div class="t-card__actions"><a class="t-link" href="' + esc(p.href) + '">Voir la fiche</a><button class="t-cmp" type="button" data-compare-add="' + esc(p.slug) + '" aria-pressed="false"><svg class="t-cmp__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>Comparer</span></button></div></div></article>';
  };
  G.renderCompare = function (list) {
    var rows = G.compareRows(list);
    return '<div class="t-compare"><table><thead><tr><th></th>' + list.map(function (p) { return '<th><img src="' + esc(p.img) + '" alt=""><a href="' + esc(p.href) + '">' + esc(p.name) + '</a></th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th>' + r.slice(2).map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };
  function fogCards(list, container) {
    if (!G.gsap || G.reduced) return;
    G.gsap.fromTo(container.children, { opacity: 0, filter: 'blur(10px)', y: 14 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9, ease: EASE, stagger: 0.03, overwrite: true });
    G.gsap.fromTo($$('.t-band__bar', container), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.inOut', stagger: 0.02 });
  }

  // ---------- boot ----------
  var m = G.initMotion ? G.initMotion({ lerp: 0.075 }) : { reduced: true };
  G.gsap = m.gsap; G.reduced = m.reduced; G.lenis = m.lenis; G.ScrollTrigger = m.ScrollTrigger;
  initHeader();
  beforeAfter();
  widthFilter();
  teaser();
  gallery();
  if (G.initCompare) G.initCompare({ renderTable: G.renderCompare });
  if (G.initCatalogue) G.initCatalogue({ renderCard: G.renderCard, onRender: fogCards, emptyHtml: '<p class="t-empty">Aucune machine ne correspond à ces critères.</p>' });
  var emptyTpl = $('[data-guide-empty]');
  if (G.initGuide) G.initGuide({ renderItem: G.renderCard, emptyHtml: emptyTpl ? emptyTpl.innerHTML : '', onRender: function () { var c = $('[data-guide-results]'); if (c) fogCards(null, c); } });
  if (G.initContact) G.initContact();
  sectorsUI(m);
  surfaces(m);
  if (!m.reduced && m.gsap) {
    try {
      veil(m);
      progress(m);
      heroIntro(m);
      haze();
      heroBlade(m);
      reveals(m);
      if (G.ambient) G.ambient(m);
      valuesTrail(m);
      stoneUI(m);
      buttons(m);
      if (G.tracePage) G.tracePage(m);
      if (m.ScrollTrigger.sort) m.ScrollTrigger.sort();
      m.ScrollTrigger.refresh();
      window.addEventListener('load', function () { m.ScrollTrigger.refresh(); });
    } catch (err) {
      document.documentElement.classList.remove('js-motion');
      var vl = $('[data-veil]');
      if (vl) vl.style.visibility = 'hidden';
      if (window.console) console.error(err);
    }
  }
})();
