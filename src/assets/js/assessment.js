/* Operational Drag Assessment.

   Entirely client-side: no answers leave the browser, which is worth saying on
   the page because people are being asked about their employer's dysfunction.

   The markup ships with every question present and the results panel hidden, so
   with JS off the page still reads as a usable questionnaire. */

(function () {
  "use strict";

  var root = document.querySelector("[data-assessment]");
  if (!root) return;

  var config = JSON.parse(document.getElementById("assessment-config").textContent);
  var form = root.querySelector("[data-assessment-form]");
  var results = root.querySelector("[data-assessment-results]");
  var progressFill = root.querySelector("[data-assessment-progress]");
  var progressText = root.querySelector("[data-assessment-progress-text]");
  var submit = root.querySelector("[data-assessment-submit]");
  var reset = root.querySelector("[data-assessment-reset]");

  var total = config.questions.length;
  var maxScore = total * 4;

  function answered() {
    return config.questions.filter(function (q) {
      return form.querySelector('input[name="' + q.id + '"]:checked');
    }).length;
  }

  function updateProgress() {
    var n = answered();
    var pct = Math.round((n / total) * 100);
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = n + " of " + total + " answered";
    if (submit) submit.disabled = n < total;
  }

  function score() {
    var byCategory = {};
    config.categories.forEach(function (c) {
      byCategory[c.key] = { sum: 0, count: 0 };
    });

    var sum = 0;
    config.questions.forEach(function (q) {
      var checked = form.querySelector('input[name="' + q.id + '"]:checked');
      var value = checked ? parseInt(checked.value, 10) : 0;
      sum += value;
      byCategory[q.category].sum += value;
      byCategory[q.category].count += 1;
    });

    return { total: sum, byCategory: byCategory };
  }

  function bandFor(value) {
    for (var i = 0; i < config.bands.length; i++) {
      if (value <= config.bands[i].max) return config.bands[i];
    }
    return config.bands[config.bands.length - 1];
  }

  function render(result) {
    var band = bandFor(result.total);

    /* Rank categories worst-first so the advice leads with the real problem. */
    var ranked = config.categories
      .map(function (c) {
        var d = result.byCategory[c.key];
        var catMax = d.count * 4;
        return {
          cat: c,
          sum: d.sum,
          max: catMax,
          pct: catMax ? Math.round((d.sum / catMax) * 100) : 0
        };
      })
      .sort(function (a, b) { return b.pct - a.pct; });

    var html = "";

    html +=
      '<div class="viz"><div class="viz__head">' +
      '<p class="viz__title">Your result</p></div>' +
      '<div class="hero-figure"><div class="hero-figure__value">' +
      result.total + "<span style=\"font-size:.4em;color:var(--ink-faint)\"> / " + maxScore + "</span>" +
      '</div><div class="hero-figure__label"><strong>' + band.label + ".</strong> " + band.verdict +
      "</div></div></div>";

    html += '<div class="viz"><div class="viz__head"><p class="viz__title">Where the drag sits</p>' +
      '<p class="viz__sub">Each category as a share of its own maximum, worst first.</p></div>' +
      '<div class="barchart">';

    ranked.forEach(function (r) {
      html +=
        '<div class="bar-row" data-series="' + r.cat.series + '">' +
        '<div class="bar-row__label">' + r.cat.label + "</div>" +
        '<div class="bar-row__track"><div class="bar-row__fill" style="width:' + r.pct + '%"' +
        ' data-viz-mark data-label="' + r.cat.label + '" data-value="' + r.sum + " of " + r.max + '"' +
        ' data-note="' + r.cat.description.replace(/"/g, "&quot;") + '"></div></div>' +
        '<div class="bar-row__value">' + r.pct + "%</div>" +
        "</div>";
    });

    html += "</div>";

    html += '<table class="viz-table" style="margin-top:2rem"><thead><tr>' +
      '<th scope="col">Category</th><th scope="col">Score</th><th scope="col">Share</th>' +
      "</tr></thead><tbody>";
    ranked.forEach(function (r) {
      html += "<tr><td>" + r.cat.label + "</td><td>" + r.sum + " / " + r.max + "</td><td>" + r.pct + "%</td></tr>";
    });
    html += "</tbody></table></div>";

    html += '<div class="study-section"><h2>What I&rsquo;d do first</h2>' +
      '<p class="lede measure">' + band.action + "</p>";

    var worst = ranked[0];
    if (worst.pct > 0) {
      html +=
        '<div class="principle" style="margin-top:1.5rem"><h3>Start with ' +
        worst.cat.label.toLowerCase() + "</h3>" +
        '<p class="prose">' + worst.cat.advice + "</p></div>";
    }
    html += "</div>";

    results.innerHTML = html;
    results.removeAttribute("hidden");
    results.setAttribute("tabindex", "-1");
    results.focus();
    results.scrollIntoView({ behavior: "smooth", block: "start" });

    /* Re-bind tooltips for the marks we just injected. */
    if (window.vizBindMarks) window.vizBindMarks(results);
  }

  form.addEventListener("change", updateProgress);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (answered() < total) return;
    render(score());
  });

  if (reset) {
    reset.addEventListener("click", function () {
      form.reset();
      results.setAttribute("hidden", "");
      results.innerHTML = "";
      updateProgress();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  updateProgress();
})();
