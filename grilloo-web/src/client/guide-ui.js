// Classic script. Wires GRILLOO.recommend (grilloo-lib.js) to the guide form.
// Markup: form[data-guide] with fields surfaceType, area, hours, energy, cluttered; [data-guide-results]; [data-guide-needed].
(function (root) {
  var G = (root.GRILLOO = root.GRILLOO || {});

  G.initGuide = function (opts) {
    var form = document.querySelector('[data-guide]');
    if (!form || !G.recommend) return null;
    var products = G.readJson('catalogue-data') || [];
    var out = document.querySelector('[data-guide-results]');
    var needed = document.querySelectorAll('[data-guide-needed]');

    // Prefill from ?surfaceType=&area=&hours= (sent by the home teaser).
    var qs = new URLSearchParams(root.location.search);
    ['area', 'hours'].forEach(function (k) {
      var v = Number(qs.get(k));
      if (form.elements[k] && Number.isFinite(v) && v > 0) form.elements[k].value = String(v);
    });
    var st = qs.get('surfaceType');
    Array.prototype.forEach.call(form.querySelectorAll('input[name="surfaceType"]'), function (r) { if (st && r.value === st) r.checked = true; });

    function run() {
      var fd = new FormData(form);
      var q = {
        surfaceType: fd.get('surfaceType'),
        area: fd.get('area'),
        hours: fd.get('hours'),
        energy: fd.get('energy') || 'indifferent',
        cluttered: fd.get('cluttered') === 'on'
      };
      var r = G.recommend(products, q);
      Array.prototype.forEach.call(needed, function (n) {
        n.textContent = r.needed === null ? '—' : r.needed.toLocaleString('fr-FR');
      });
      out.innerHTML = r.items.length ? r.items.map(opts.renderItem).join('') : opts.emptyHtml;
      if (opts.onRender) opts.onRender(r, q);
    }

    form.addEventListener('input', run);
    form.addEventListener('change', run);
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    run();
    return { run: run };
  };
})(typeof window !== 'undefined' ? window : globalThis);
