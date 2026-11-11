// Classic script. Wires GRILLOO.filterProducts (grilloo-lib.js) to the catalogue markup.
// Markup: [data-catalogue] root, [data-filter="gamme|energy|q|sort|minProductivity"], [data-results], [data-count].
(function (root) {
  var G = (root.GRILLOO = root.GRILLOO || {});

  G.initCatalogue = function (opts) {
    var host = document.querySelector('[data-catalogue]');
    if (!host || !G.filterProducts) return null;
    var products = G.readJson('catalogue-data') || [];
    var inputs = host.querySelectorAll('[data-filter]');
    var results = host.querySelector('[data-results]');
    var counts = host.querySelectorAll('[data-count]');
    var qs = new URLSearchParams(root.location.search);

    Array.prototype.forEach.call(inputs, function (i) {
      var k = i.getAttribute('data-filter');
      if (!qs.has(k)) return;
      var v = qs.get(k);
      if (i.type === 'radio' || i.type === 'checkbox') {
        var group = host.querySelectorAll('[data-filter="' + k + '"]');
        var known = Array.prototype.some.call(group, function (x) { return x.value === v; });
        if (known) i.checked = i.value === v;
      } else if (i.tagName === 'SELECT') {
        if (Array.prototype.some.call(i.options, function (o) { return o.value === v; })) i.value = v;
      } else i.value = v;
    });

    function state() {
      var s = {};
      Array.prototype.forEach.call(inputs, function (i) {
        var k = i.getAttribute('data-filter');
        if (i.type === 'radio' || i.type === 'checkbox') { if (i.checked) s[k] = i.value; }
        else if (i.value) s[k] = i.value;
      });
      return s;
    }

    function render() {
      var list = G.filterProducts(products, state());
      results.innerHTML = list.length ? list.map(opts.renderCard).join('') : (opts.emptyHtml || '');
      Array.prototype.forEach.call(counts, function (c) { c.textContent = String(list.length); });
      if (G.syncCompare) G.syncCompare();
      if (opts.onRender) opts.onRender(list, results);
    }

    Array.prototype.forEach.call(inputs, function (i) {
      var ev = i.type === 'search' || i.type === 'text' ? 'input' : 'change';
      i.addEventListener(ev, render);
    });
    render();
    return { render: render };
  };
})(typeof window !== 'undefined' ? window : globalThis);
