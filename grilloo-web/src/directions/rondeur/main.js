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

  // ---------- iris page transitions ----------
  function iris() {
    var el = $('[data-iris]');
    if (!el || G.reduced) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target || a.hasAttribute('download') || /^(mailto|tel|https?):/.test(href) || /\.pdf$/i.test(href)) return;
      e.preventDefault();
      el.style.setProperty('--x', e.clientX + 'px');
      el.style.setProperty('--y', e.clientY + 'px');
      el.style.transition = '';
      el.style.clipPath = '';
      el.classList.add('is-closing');
      setTimeout(function () { window.location.href = a.href; }, 600);
    });
    window.addEventListener('pageshow', function (ev) { if (ev.persisted) { el.classList.remove('is-closing'); el.style.clipPath = 'circle(0% at 50% 50%)'; } });
  }

  // ---------- magnetic buttons ----------
  function magnetic() {
    if (!window.matchMedia('(pointer: fine)').matches || !G.gsap) return;
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        G.gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.6, ease: 'power3.out' });
      });
      b.addEventListener('pointerleave', function () { G.gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }); });
    });
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
      m.gsap.to(el, { yPercent: -62, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
    });
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
      gsap.from(c.children, { scale: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.06, scrollTrigger: { trigger: c, start: 'top 90%', once: true } });
    });
    $$('[data-porthole]').forEach(function (sec) {
      var disc = $('[data-porthole-disc]', sec);
      gsap.fromTo(disc, { '--s': 0.25 }, { '--s': 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'center center', scrub: true } });
    });
    $$('.r-portimg').forEach(function (fig) {
      gsap.fromTo(fig, { clipPath: 'inset(0% 30% 0% 30% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px)', ease: 'none', scrollTrigger: { trigger: fig, start: 'top 95%', end: 'center 55%', scrub: true } });
    });
    $$('.r-alt__img, .r-sector__disc').forEach(function (d) {
      gsap.fromTo(d, { clipPath: 'circle(18% at 50% 50%)' }, { clipPath: 'circle(70.7% at 50% 50%)', duration: 1.4, ease: EASE, scrollTrigger: { trigger: d, start: 'top 88%', once: true } });
    });
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
  initHeader();
  carousel();
  dial();
  gallery();
  if (G.initCompare) G.initCompare({ renderTable: G.renderCompare });
  if (G.initCatalogue) G.initCatalogue({ renderCard: G.renderCard, onRender: popCards, emptyHtml: '<p class="r-empty">Aucune machine ne correspond à ces critères.</p>' });
  var tpl = $('[data-guide-empty]');
  if (G.initGuide) G.initGuide({ renderItem: G.renderCard, emptyHtml: tpl ? tpl.innerHTML : '', onRender: function () { popCards(null, $('[data-guide-results]')); } });
  if (G.initContact) G.initContact();
  if (!m.reduced && m.gsap) {
    try {
      iris();
      magnetic();
      spin(m);
      reveals(m);
      if (G.ambient) G.ambient(m);
      window.addEventListener('load', function () { m.ScrollTrigger.refresh(); });
    } catch (err) {
      document.documentElement.classList.remove('js-motion');
      if (window.console) console.error(err);
    }
  }
})();
