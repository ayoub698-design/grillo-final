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
        x: function () { return stage.getBoundingClientRect().width * 0.75; },
        duration: 4.2, delay: 0.5, ease: 'power2.out',
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

  // ---------- horizontal sectors gallery (pinned on desktop) ----------
  function hscroll(m) {
    var sec = $('[data-hscroll]');
    if (!sec || window.innerWidth < 900) return;
    var track = $('[data-hscroll-track]', sec);
    sec.classList.add('is-pinned');
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    m.gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.6, pin: true, invalidateOnRefresh: true } });
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
  if (!m.reduced && m.gsap) {
    try {
      haze();
      reveals(m);
      if (G.ambient) G.ambient(m);
      hscroll(m);
      if (G.tracePage) G.tracePage(m);
      window.addEventListener('load', function () { m.ScrollTrigger.refresh(); });
    } catch (err) {
      document.documentElement.classList.remove('js-motion');
      if (window.console) console.error(err);
    }
  }
})();
