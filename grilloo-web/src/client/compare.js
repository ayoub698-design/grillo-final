// Classic script. Comparator (2–3 machines) persisted in localStorage (guarded).
// Markup: [data-compare-add="slug"] toggles, [data-compare-bar] tray with [data-compare-count] / [data-compare-list],
// [data-compare-open], [data-compare-clear], <dialog data-compare-dialog> with [data-compare-table] and [data-compare-close].
(function (root) {
  var G = (root.GRILLOO = root.GRILLOO || {});
  var KEY = 'grilloo-compare';
  var MAX = 3;

  G.KEY_LABELS = [
    ['productivity', 'Rendement', 'm²/h'],
    ['width', 'Largeur de travail', 'mm'],
    ['tank', 'Réservoir / cuve', 'L'],
    ['autonomy', 'Autonomie', 'h'],
    ['power', 'Puissance', 'W'],
    ['weight', 'Poids', 'kg'],
    ['energy', 'Énergie', '']
  ];
  G.ENERGY = { batterie: 'Batterie', secteur: 'Secteur', manuel: 'Manuelle', thermique: 'Thermique', pneumatique: 'Pneumatique' };

  // Rows of comparable key figures: [[label, unit, value1, value2, ...]] (only rows with at least one value).
  G.compareRows = function (products) {
    return G.KEY_LABELS.map(function (k) {
      var vals = products.map(function (p) {
        var v = p.key && p.key[k[0]];
        if (v === null || v === undefined || v === '') return '—';
        if (k[0] === 'energy') return G.ENERGY[v] || v;
        return typeof v === 'number' ? v.toLocaleString('fr-FR') + (k[2] ? ' ' + k[2] : '') : String(v);
      });
      return [k[1], k[2]].concat(vals);
    }).filter(function (row) { return row.slice(2).some(function (v) { return v !== '—'; }); });
  };

  G.initCompare = function (opts) {
    var products = G.readJson('catalogue-data') || [];
    var bySlug = Object.create(null);
    products.forEach(function (p) { bySlug[p.slug] = p; });
    var bar = document.querySelector('[data-compare-bar]');
    var dialog = document.querySelector('[data-compare-dialog]');

    function load() {
      try { return JSON.parse(root.localStorage.getItem(KEY) || '[]').filter(function (s) { return bySlug[s]; }).slice(0, MAX); }
      catch (e) { return []; }
    }
    function save() { try { root.localStorage.setItem(KEY, JSON.stringify(sel)); } catch (e) { /* storage blocked */ } }
    var sel = load();

    function sync() {
      Array.prototype.forEach.call(document.querySelectorAll('[data-compare-add]'), function (b) {
        var on = sel.indexOf(b.getAttribute('data-compare-add')) !== -1;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.disabled = !on && sel.length >= MAX;
      });
      if (!bar) return;
      bar.hidden = sel.length === 0;
      var c = bar.querySelector('[data-compare-count]');
      if (c) c.textContent = String(sel.length);
      var l = bar.querySelector('[data-compare-list]');
      if (l) l.textContent = sel.map(function (s) { return bySlug[s].name; }).join(' · ');
      var o = bar.querySelector('[data-compare-open]');
      if (o) o.disabled = sel.length < 2;
    }
    G.syncCompare = sync;

    document.addEventListener('click', function (e) {
      var t = e.target;
      var add = t.closest && t.closest('[data-compare-add]');
      if (add) {
        var s = add.getAttribute('data-compare-add');
        var i = sel.indexOf(s);
        if (i === -1 && sel.length < MAX) sel.push(s); else if (i !== -1) sel.splice(i, 1);
        save(); sync();
        return;
      }
      if (t.closest && t.closest('[data-compare-open]') && dialog) {
        dialog.querySelector('[data-compare-table]').innerHTML = opts.renderTable(sel.map(function (x) { return bySlug[x]; }));
        if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
        return;
      }
      if (t.closest && t.closest('[data-compare-clear]')) { sel = []; save(); sync(); return; }
      if (t.closest && t.closest('[data-compare-close]') && dialog) dialog.close();
    });
    sync();
    return { sync: sync };
  };
})(typeof window !== 'undefined' ? window : globalThis);
