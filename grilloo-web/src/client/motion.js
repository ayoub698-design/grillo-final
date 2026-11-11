// Classic script. Motion bootstrap shared by every direction: reduced-motion gate, GSAP plugins, Lenis.
// The inline head boot (seo.mjs) adds html.js-motion early; this file confirms it or removes it.
(function (root) {
  var G = (root.GRILLOO = root.GRILLOO || {});

  G.readJson = function (id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  };

  root.addEventListener('error', function () { document.documentElement.classList.remove('js-motion'); });

  G.initMotion = function (opts) {
    opts = opts || {};
    var html = document.documentElement;
    var reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsap = root.gsap;
    var api = { gsap: gsap, ScrollTrigger: root.ScrollTrigger, SplitText: root.SplitText, Flip: root.Flip, lenis: null, reduced: !!reduced };
    root.GRILLOO_MOTION_READY = true;
    if (!gsap || reduced) {
      html.classList.remove('js-motion');
      html.classList.add('no-motion');
      return api;
    }
    gsap.registerPlugin.apply(gsap, [root.ScrollTrigger, root.SplitText, root.Flip].filter(Boolean));
    html.classList.add('js-motion');
    if (opts.smooth !== false && root.Lenis) {
      var lenis = new root.Lenis({ lerp: opts.lerp || 0.09, wheelMultiplier: 1 });
      if (root.ScrollTrigger) lenis.on('scroll', root.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      api.lenis = lenis;
      // in-page anchors through Lenis
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href').length < 2) return;
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -(opts.anchorOffset || 96) });
      });
    }
    return api;
  };

  // Ambient image motion shared by all directions (call after initMotion when motion is allowed):
  //   [data-parallax="0.12"]  vertical drift while scrolling (factor of the element height)
  //   [data-float="8"]        slow endless float (amplitude in px), desynchronised
  //   [data-mask]             clip-path wipe reveal when entering the viewport (value: up|left|circle)
  //   [data-kenburns]         very slow scale/pan loop on hero images
  G.ambient = function (m) {
    if (!m || !m.gsap || m.reduced) return;
    var gsap = m.gsap;
    Array.prototype.forEach.call(document.querySelectorAll('[data-parallax]'), function (el) {
      var f = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      gsap.fromTo(el, { yPercent: -f * 100 }, { yPercent: f * 100, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-float]'), function (el, i) {
      var a = parseFloat(el.getAttribute('data-float')) || 8;
      gsap.to(el, { y: -a, rotation: (i % 2 ? -1 : 1) * a * 0.08, duration: 2.8 + (i % 5) * 0.45, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 7) * 0.3 });
    });
    var FROM = { up: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', down: 'inset(0% 0% 100% 0%)', circle: 'circle(0% at 50% 50%)' };
    var TO = { up: 'inset(0% 0% 0% 0%)', left: 'inset(0% 0% 0% 0%)', down: 'inset(0% 0% 0% 0%)', circle: 'circle(75% at 50% 50%)' };
    if (m.ScrollTrigger) m.ScrollTrigger.batch('[data-mask]', {
      start: 'top 90%', once: true,
      onEnter: function (els) {
        els.forEach(function (el, i) {
          var k = el.getAttribute('data-mask') || 'up';
          gsap.fromTo(el, { clipPath: FROM[k] || FROM.up }, { clipPath: TO[k] || TO.up, duration: 1.4, ease: 'expo.out', delay: i * 0.14, onComplete: function () { el.style.clipPath = ''; el.removeAttribute('data-mask'); } });
        });
      },
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-kenburns]'), function (el) {
      gsap.fromTo(el, { scale: 1.08, xPercent: -1.5 }, { scale: 1, xPercent: 1.5, duration: 18, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
  };

  // Calls fn(el) once when each element enters the viewport (fallback: immediately).
  G.onEnter = function (selectorOrEls, fn, opts) {
    var els = typeof selectorOrEls === 'string' ? document.querySelectorAll(selectorOrEls) : selectorOrEls;
    opts = opts || {};
    if (!('IntersectionObserver' in root)) { Array.prototype.forEach.call(els, fn); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); }
      });
    }, { rootMargin: opts.rootMargin || '0px 0px -12% 0px', threshold: opts.threshold || 0 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  };
})(typeof window !== 'undefined' ? window : globalThis);
