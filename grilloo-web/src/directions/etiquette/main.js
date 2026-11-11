// Étiquette — interactions & motion (classic script, runs after shared GRILLOO modules).
(function () {
  'use strict';
  var G = window.GRILLOO || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'power4.out';

  // ---------- header: hide on scroll down, mega menu, drawer ----------
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var lastY = window.scrollY;
    var mega = $('[data-mega]');
    var megaBtn = $('[data-mega-toggle]');
    var drawer = $('[data-drawer]');
    var drawerBtn = $('[data-drawer-toggle]');
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      var open = megaBtn && megaBtn.getAttribute('aria-expanded') === 'true';
      if (!open && !(drawer && !drawer.hidden)) header.classList.toggle('is-hidden', y > lastY && y > 240);
      lastY = y;
    }, { passive: true });

    function setMega(open) {
      if (!mega || !megaBtn) return;
      megaBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        mega.hidden = false;
        if (G.gsap && !G.reduced) {
          G.gsap.fromTo(mega, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: EASE });
          G.gsap.fromTo($$('.e-mega__item, .e-mega__all', mega), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: EASE, stagger: 0.035, delay: 0.08 });
        }
      } else {
        mega.hidden = true;
      }
    }
    if (megaBtn) {
      megaBtn.addEventListener('click', function () { setMega(megaBtn.getAttribute('aria-expanded') !== 'true'); });
      var t;
      [megaBtn, mega].forEach(function (el) {
        el.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { clearTimeout(t); setMega(true); } });
        el.addEventListener('mouseleave', function () { if (window.matchMedia('(hover: hover)').matches) { t = setTimeout(function () { setMega(false); }, 220); } });
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && megaBtn.getAttribute('aria-expanded') === 'true') { setMega(false); megaBtn.focus(); } });
      document.addEventListener('click', function (e) { if (!header.contains(e.target)) setMega(false); });
    }
    if (drawerBtn && drawer) {
      drawerBtn.addEventListener('click', function () {
        var open = drawer.hidden;
        drawer.hidden = !open;
        drawerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open && G.lenis) G.lenis.stop(); else if (G.lenis) G.lenis.start();
      });
    }
  }

  // ---------- reveals ----------
  function splitHeadings(gsap, SplitText) {
    $$('[data-split]').forEach(function (el) {
      if (!SplitText) { el.style.visibility = 'visible'; return; }
      var split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'e-line' });
      el.style.visibility = 'visible';
      gsap.from(split.lines, { yPercent: 105, duration: 0.85, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  function reveals(gsap, ScrollTrigger) {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%', once: true,
      onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.05, overwrite: true }); },
    });
    $$('[data-rule]').forEach(function (el) {
      gsap.to(el, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('[data-print]').forEach(function (el) {
      gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power2.out', delay: 0.15, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('[data-notch]').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: EASE, delay: 0.6, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('[data-steps-line]').forEach(function (el) {
      gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top 70%', end: 'bottom 70%', scrub: true } });
    });
    $$('[data-scale]').forEach(function (el) {
      gsap.to(el, { '--p': 1, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      gsap.from(el.children, { opacity: 0, y: 10, duration: 0.6, ease: EASE, stagger: 0.08, delay: 0.3, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
  }

  // ---------- hero specimen: callouts draw in ----------
  function specimen(gsap) {
    var s = $('[data-specimen]');
    if (!s) return;
    var tl = gsap.timeline({ delay: 0.35 });
    tl.from($('.e-specimen__img, .e-scene__img', s), { opacity: 0, y: 40, scale: 0.96, duration: 1.4, ease: EASE });
    $$('[data-callout]', s).forEach(function (c, i) {
      var path = $('path', c);
      tl.set(c, { opacity: 1 }, 0.7 + i * 0.22);
      if (path) {
        var len = 160;
        tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.7 + i * 0.22);
      }
      var line = $('.e-dim__line', c);
      if (line) tl.from(line, { scaleX: 0, duration: 0.9, ease: 'power3.inOut' }, 0.7 + i * 0.22);
      tl.from($('p', c), { opacity: 0, y: 8, duration: 0.6, ease: EASE }, 1.1 + i * 0.22);
    });
  }

  function band(gsap) {
    var b = $('[data-band]');
    if (!b) return;
    var img = $('img', b);
    gsap.fromTo(b, { clipPath: 'inset(10% 7% 0% 7%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: b, start: 'top 95%', end: 'top 25%', scrub: true } });
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ---------- sticky gammes index with Flip marker ----------
  function gammesIndex(ScrollTrigger, Flip) {
    var list = $('[data-index]');
    if (!list) return;
    var marker = $('[data-index-marker]', list);
    var items = $$('[data-index-item]', list);
    var current = -1;
    function activate(i) {
      if (i === current) return;
      current = i;
      items.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
      var target = items[i];
      if (!target) return;
      var y = target.offsetTop + 15;
      if (Flip && marker) {
        var state = Flip.getState(marker);
        marker.style.top = y + 'px';
        Flip.from(state, { duration: 0.6, ease: EASE });
      } else if (marker) { marker.style.top = y + 'px'; }
    }
    $$('[data-index-row]').forEach(function (row) {
      ScrollTrigger.create({ trigger: row, start: 'top 55%', end: 'bottom 55%', onToggle: function (self) { if (self.isActive) activate(Number(row.getAttribute('data-index-row'))); } });
    });
    activate(0);
  }

  // ---------- guide teaser (sentence form) ----------
  function teaser() {
    var f = $('[data-teaser]');
    if (!f || !G.recommend) return;
    var products = G.readJson('catalogue-data') || [];
    var needed = $('[data-teaser-needed]', f);
    var count = $('[data-teaser-count]', f);
    function run() {
      var r = G.recommend(products, { surfaceType: f.surfaceType.value, area: f.area.value, hours: f.hours.value, limit: Infinity });
      needed.textContent = r.needed === null ? '—' : r.needed.toLocaleString('fr-FR');
      count.textContent = String(r.items.length);
    }
    f.addEventListener('input', run);
    f.addEventListener('change', run);
    run();
  }

  // ---------- spec row ↔ dimension line on the photo ----------
  function dimLinks() {
    $$('tr[data-dim]').forEach(function (row) {
      var target = $('[data-dim-target="' + row.getAttribute('data-dim') + '"]');
      if (!target) return;
      row.addEventListener('mouseenter', function () { target.classList.add('is-hot'); });
      row.addEventListener('mouseleave', function () { target.classList.remove('is-hot'); });
    });
  }

  // ---------- product page: sticky tabs with sliding indicator + scrollspy ----------
  function tabs() {
    var nav = $('[data-tabs]');
    if (!nav) return;
    var links = $$('[data-tab]', nav);
    var ind = $('[data-tabs-ind]', nav);
    function move(link) {
      links.forEach(function (l) { l.classList.toggle('is-active', l === link); });
      if (!ind || !link) return;
      var x = link.offsetLeft, w = link.offsetWidth;
      if (G.gsap && !G.reduced) G.gsap.to(ind, { x: x, width: w, duration: 0.55, ease: EASE });
      else { ind.style.transform = 'translateX(' + x + 'px)'; ind.style.width = w + 'px'; }
    }
    move(links[0]);
    var sections = links.map(function (l) { return document.getElementById(l.getAttribute('data-tab')); }).filter(Boolean);
    function spy() {
      var y = window.innerHeight * 0.35, cur = sections[0];
      sections.forEach(function (s) { if (s.getBoundingClientRect().top < y) cur = s; });
      var link = links.filter(function (l) { return l.getAttribute('data-tab') === cur.id; })[0];
      if (link && !link.classList.contains('is-active')) move(link);
    }
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', function () { move($('.is-active', nav)); });
  }

  // ---------- product gallery thumbnails ----------
  function gallery() {
    var g = $('[data-gallery]');
    if (!g) return;
    var main = $('.e-pp__img', g);
    $$('[data-gallery-src]', g).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-gallery-src]', g).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        main.style.opacity = '0';
        setTimeout(function () { main.src = b.getAttribute('data-gallery-src'); main.style.opacity = '1'; }, 200);
      });
    });
  }

  // ---------- client card templates (mirror components.mjs) ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var ICON_ARROW = '<svg class="e-link__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  var ICON_PLUS = '<svg class="e-cmp__ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var FIGS = [['productivity', 'Rendement', 'm²/h'], ['width', 'Largeur de travail', 'mm'], ['tank', 'Réservoir', 'L'], ['autonomy', 'Autonomie', 'h'], ['power', 'Puissance', 'W'], ['weight', 'Poids', 'kg']];
  var TANK = { aspirateurs: 'Cuve', balayeuses: 'Bac à déchets', 'textiles-sechage': 'Réservoir' };
  G.cardFigures = function (p, max) {
    return FIGS.filter(function (f) { return typeof (p.key || {})[f[0]] === 'number'; }).slice(0, max || 3).map(function (f) {
      var label = f[0] === 'tank' ? (TANK[p.gamme] || f[1]) : f[0] === 'width' && p.gamme === 'balayeuses' ? 'Largeur de balayage' : f[1];
      return { label: label, value: p.key[f[0]].toLocaleString('fr-FR', { maximumFractionDigits: 1 }), unit: f[2] };
    });
  };
  G.renderCard = function (p) {
    var figs = G.cardFigures(p, 3);
    return '<article class="e-card">' +
      '<a class="e-card__media" href="' + esc(p.href) + '" tabindex="-1" aria-hidden="true"><img class="e-card__img" src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async"><span class="e-card__kind">' + esc(p.kind) + '</span></a>' +
      '<div class="e-card__body"><h3 class="e-card__name"><a href="' + esc(p.href) + '"><span class="e-card__brand">GRILLOO</span> ' + esc(p.name) + '</a></h3>' +
      (figs.length ? '<dl class="e-card__figs">' + figs.map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '<small>' + esc(f.unit) + '</small></dd></div>'; }).join('') + '</dl>' : '<p class="e-card__none">' + esc(p.kind) + '</p>') +
      '<div class="e-card__actions"><a class="e-link" href="' + esc(p.href) + '">Fiche technique ' + ICON_ARROW + '</a>' +
      '<button class="e-cmp" type="button" data-compare-add="' + esc(p.slug) + '" aria-pressed="false">' + ICON_PLUS + '<span>Comparer</span></button></div></div></article>';
  };
  G.renderCompare = function (list) {
    var rows = G.compareRows(list);
    return '<div class="e-compare"><table><thead><tr><th></th>' + list.map(function (p) {
      return '<th><img src="' + esc(p.img) + '" alt=""><span class="e-card__brand">GRILLOO</span><br><a class="e-card__name" href="' + esc(p.href) + '">' + esc(p.name) + '</a></th>';
    }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th>' + r.slice(2).map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
  };

  function animateCards(list, container) {
    if (!G.gsap || G.reduced) return;
    G.gsap.fromTo(container.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: EASE, stagger: { each: 0.025, from: 'start' }, overwrite: true });
  }

  // ---------- boot ----------
  var motion = G.initMotion ? G.initMotion({ lerp: 0.1 }) : { reduced: true };
  G.gsap = motion.gsap; G.reduced = motion.reduced; G.lenis = motion.lenis;
  initHeader();
  teaser();
  dimLinks();
  tabs();
  gallery();
  if (G.initCompare) G.initCompare({ renderTable: G.renderCompare });
  if (G.initCatalogue) G.initCatalogue({ renderCard: G.renderCard, onRender: animateCards, emptyHtml: '<p class="e-empty">Aucune machine ne correspond à ces critères.</p>' });
  if (G.initGuide) G.initGuide({ renderItem: G.renderCard, emptyHtml: document.querySelector('[data-guide-empty]') ? document.querySelector('[data-guide-empty]').innerHTML : '' });
  if (G.initContact) G.initContact();
  if (!motion.reduced && motion.gsap) {
    try {
      splitHeadings(motion.gsap, motion.SplitText);
      reveals(motion.gsap, motion.ScrollTrigger);
      specimen(motion.gsap);
      band(motion.gsap);
      if (G.ambient) G.ambient(motion);
      gammesIndex(motion.ScrollTrigger, motion.Flip);
      if (G.etiquettePage) G.etiquettePage(motion);
      window.addEventListener('load', function () { motion.ScrollTrigger.refresh(); });
    } catch (err) {
      document.documentElement.classList.remove('js-motion');
      if (window.console) console.error(err);
    }
  }
})();
