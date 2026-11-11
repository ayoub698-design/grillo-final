// Classic script. Quote form: ?machine= prefill (whitelisted), mailto fallback when opened over file://.
// Markup: form[data-contact][data-mailto] with select[name="machine"]; optional [data-contact-ok] message.
// Labels wrap their field: <label><span>Short label</span><input …></label> — the <span> gives the short label.
(function (root) {
  var G = (root.GRILLOO = root.GRILLOO || {});
  var NL = String.fromCharCode(10);

  G.prefillMachine = function (search, slugs) {
    var v = '';
    try { v = new URLSearchParams(search || '').get('machine') || ''; } catch (e) { return ''; }
    return slugs.indexOf(v) !== -1 ? v : '';
  };

  // fields: [{ name, label, value, text, type, checked }] → ["Label : value", …]
  G.formLines = function (fields) {
    var SKIP = { 'form-name': 1, 'bot-field': 1 };
    return fields.filter(function (f) {
      return f.name && !SKIP[f.name] && f.type !== 'hidden' && f.type !== 'submit' && f.type !== 'checkbox' && f.type !== 'radio' && f.value;
    }).map(function (f) { return (f.label || f.name) + ' : ' + (f.text || f.value); });
  };

  function shortLabel(el) {
    var l = el.labels && el.labels[0];
    if (!l) return el.name;
    var s = l.querySelector('span');
    return (s ? s.textContent : l.textContent).replace(/\s+/g, ' ').replace(/\s*\*$/, '').trim();
  }

  G.initContact = function () {
    var form = document.querySelector('[data-contact]');
    if (!form) return;
    var sel = form.querySelector('select[name="machine"]');
    if (sel) {
      var slugs = Array.prototype.map.call(sel.options, function (o) { return o.value; }).filter(Boolean);
      var v = G.prefillMachine(root.location.search, slugs);
      if (v) sel.value = v;
    }
    form.addEventListener('submit', function (e) {
      if (root.location.protocol !== 'file:') return; // Netlify Forms handles it once deployed
      e.preventDefault();
      if (!form.reportValidity()) return;
      var ok = form.querySelector('[data-contact-ok]');
      var to = form.getAttribute('data-mailto');
      if (!to) {
        // No address supplied yet by GRILLOO: never guess one.
        if (ok) { ok.textContent = 'Adresse de réception à fournir par GRILLOO : le formulaire sera actif une fois le site en ligne.'; ok.hidden = false; }
        return;
      }
      var fields = Array.prototype.map.call(form.elements, function (el) {
        return { name: el.name, label: shortLabel(el), value: el.value, type: el.type, checked: el.checked,
          text: el.tagName === 'SELECT' ? ((el.options[el.selectedIndex] || {}).text || '') : el.value };
      });
      root.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Demande de devis — site GRILLOO') + '&body=' + encodeURIComponent(G.formLines(fields).join(NL));
      if (ok) ok.hidden = false;
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
