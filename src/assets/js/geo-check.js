/* GEO Readiness Check.

   Parses pasted HTML with DOMParser and reports on machine readability. Uses
   DOMParser rather than innerHTML so nothing in the pasted markup executes, and
   nothing is uploaded — the whole analysis happens locally. */

(function () {
  "use strict";

  var root = document.querySelector("[data-geo]");
  if (!root) return;

  var input = root.querySelector("[data-geo-input]");
  var run = root.querySelector("[data-geo-run]");
  var clear = root.querySelector("[data-geo-clear]");
  var results = root.querySelector("[data-geo-results]");
  var sample = root.querySelector("[data-geo-sample]");

  /* Each check returns { state, detail, fix }. States: pass | warn | fail.
     Weights reflect impact on whether a machine can identify the page. */
  var CHECKS = [
    {
      group: "Machine readability",
      name: "Structured data present",
      weight: 15,
      run: function (doc) {
        var blocks = doc.querySelectorAll('script[type="application/ld+json"]');
        if (!blocks.length) {
          return { state: "fail", detail: "No JSON-LD found.", fix: "Add a schema.org JSON-LD block. Without it, everything about the page has to be inferred from prose." };
        }
        var parsed = 0;
        var broken = 0;
        blocks.forEach(function (b) {
          try { JSON.parse(b.textContent); parsed++; } catch (e) { broken++; }
        });
        if (broken) {
          return { state: "fail", detail: broken + " of " + blocks.length + " JSON-LD block(s) failed to parse.", fix: "Malformed JSON-LD is silently ignored — browsers never warn. A trailing comma is the usual cause." };
        }
        return { state: "pass", detail: parsed + " valid JSON-LD block(s).", fix: "" };
      }
    },
    {
      group: "Machine readability",
      name: "Entity claims (sameAs)",
      weight: 15,
      run: function (doc) {
        var found = [];
        doc.querySelectorAll('script[type="application/ld+json"]').forEach(function (b) {
          try {
            var json = JSON.parse(b.textContent);
            var nodes = json["@graph"] || (Array.isArray(json) ? json : [json]);
            nodes.forEach(function (n) {
              if (n && n.sameAs) found = found.concat([].concat(n.sameAs));
            });
          } catch (e) {}
        });
        found = found.filter(Boolean);
        if (!found.length) {
          return { state: "fail", detail: "No sameAs links.", fix: "sameAs is how a machine connects this page to your other profiles. Without it there is nothing to corroborate the identity claim." };
        }
        if (found.length === 1) {
          return { state: "warn", detail: "Only 1 sameAs link.", fix: "One profile is an assertion; two or more start to look like verification. Add every profile you actually control." };
        }
        return { state: "pass", detail: found.length + " sameAs links.", fix: "" };
      }
    },
    {
      group: "Machine readability",
      name: "Declared language",
      weight: 4,
      run: function (doc) {
        var lang = doc.documentElement && doc.documentElement.getAttribute("lang");
        if (!lang) return { state: "warn", detail: "No lang attribute.", fix: 'Add lang="en" (or your locale) to the html element.' };
        return { state: "pass", detail: 'lang="' + lang + '".', fix: "" };
      }
    },
    {
      group: "Discovery",
      name: "Title",
      weight: 12,
      run: function (doc) {
        var t = doc.querySelector("title");
        var text = t ? t.textContent.trim() : "";
        if (!text) return { state: "fail", detail: "Missing title.", fix: "The title is the strongest single signal about what a page is." };
        if (text.length > 65) return { state: "warn", detail: text.length + " characters — likely truncated in results.", fix: "Aim for roughly 30–60 characters." };
        if (text.length < 15) return { state: "warn", detail: "Only " + text.length + " characters.", fix: "Too short to carry meaning out of context." };
        return { state: "pass", detail: text.length + " characters.", fix: "" };
      }
    },
    {
      group: "Discovery",
      name: "Meta description",
      weight: 10,
      run: function (doc) {
        var m = doc.querySelector('meta[name="description"]');
        var text = m ? (m.getAttribute("content") || "").trim() : "";
        if (!text) return { state: "fail", detail: "Missing.", fix: "This is often the sentence an AI system quotes. Write it deliberately rather than letting one be generated." };
        if (text.length > 170) return { state: "warn", detail: text.length + " characters — likely truncated.", fix: "Aim for roughly 120–160 characters." };
        if (text.length < 50) return { state: "warn", detail: "Only " + text.length + " characters.", fix: "Short descriptions waste the most quotable slot on the page." };
        return { state: "pass", detail: text.length + " characters.", fix: "" };
      }
    },
    {
      group: "Discovery",
      name: "Canonical URL",
      weight: 8,
      run: function (doc) {
        var c = doc.querySelector('link[rel="canonical"]');
        if (!c || !c.getAttribute("href")) return { state: "warn", detail: "No canonical link.", fix: "Prevents duplicate-content ambiguity when the same page is reachable by several URLs." };
        return { state: "pass", detail: c.getAttribute("href"), fix: "" };
      }
    },
    {
      group: "Sharing",
      name: "Open Graph tags",
      weight: 10,
      run: function (doc) {
        var need = ["og:title", "og:description", "og:image"];
        var missing = need.filter(function (p) {
          return !doc.querySelector('meta[property="' + p + '"]');
        });
        if (missing.length === need.length) return { state: "fail", detail: "None present.", fix: "Every share of this link renders as a blank card. For most sites this is the majority of first impressions." };
        if (missing.length) return { state: "warn", detail: "Missing: " + missing.join(", ") + ".", fix: "og:image matters most — without it the card has no visual." };
        return { state: "pass", detail: "All three present.", fix: "" };
      }
    },
    {
      group: "Structure",
      name: "Single H1",
      weight: 8,
      run: function (doc) {
        var n = doc.querySelectorAll("h1").length;
        if (n === 0) return { state: "fail", detail: "No H1.", fix: "The H1 states the page's subject in the document itself, not just the tab." };
        if (n > 1) return { state: "warn", detail: n + " H1 elements.", fix: "Multiple H1s dilute the signal. Use one, then H2s." };
        return { state: "pass", detail: "Exactly one.", fix: "" };
      }
    },
    {
      group: "Structure",
      name: "Heading hierarchy",
      weight: 6,
      run: function (doc) {
        var levels = [];
        doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(function (h) {
          levels.push(parseInt(h.tagName.substring(1), 10));
        });
        if (!levels.length) return { state: "fail", detail: "No headings at all.", fix: "Headings are how both readers and extractors find structure." };
        var skips = 0;
        for (var i = 1; i < levels.length; i++) {
          if (levels[i] - levels[i - 1] > 1) skips++;
        }
        if (skips) return { state: "warn", detail: skips + " skipped level(s).", fix: "Going H2 → H4 breaks the outline for screen readers and extractors." };
        return { state: "pass", detail: levels.length + " headings, no skipped levels.", fix: "" };
      }
    },
    {
      group: "Structure",
      name: "Image alt coverage",
      weight: 6,
      run: function (doc) {
        var imgs = doc.querySelectorAll("img");
        if (!imgs.length) return { state: "pass", detail: "No images.", fix: "" };
        var missing = 0;
        imgs.forEach(function (img) { if (!img.hasAttribute("alt")) missing++; });
        if (missing === 0) return { state: "pass", detail: "All " + imgs.length + " images have alt attributes.", fix: "" };
        var pct = Math.round((missing / imgs.length) * 100);
        return {
          state: pct > 50 ? "fail" : "warn",
          detail: missing + " of " + imgs.length + " missing alt.",
          fix: 'Decorative images need alt="" explicitly; omitting the attribute is not the same thing.'
        };
      }
    },
    {
      group: "Structure",
      name: "Content in the HTML",
      weight: 6,
      run: function (doc) {
        var body = doc.body;
        var text = body ? body.textContent.replace(/\s+/g, " ").trim() : "";
        if (text.length < 200) {
          return { state: "fail", detail: "Only " + text.length + " characters of text.", fix: "If the content arrives via JavaScript, most AI crawlers will see roughly this. Server-render it." };
        }
        if (text.length < 600) {
          return { state: "warn", detail: text.length + " characters of text.", fix: "Thin for a page meant to be quoted or summarised." };
        }
        return { state: "pass", detail: (text.length).toLocaleString() + " characters of text.", fix: "" };
      }
    }
  ];

  function analyse(html) {
    var doc = new DOMParser().parseFromString(html, "text/html");

    var rows = CHECKS.map(function (c) {
      var r;
      try { r = c.run(doc); } catch (e) { r = { state: "warn", detail: "Check could not run.", fix: "" }; }
      var earned = r.state === "pass" ? c.weight : r.state === "warn" ? c.weight * 0.5 : 0;
      return { check: c, result: r, earned: earned };
    });

    var maxScore = CHECKS.reduce(function (a, c) { return a + c.weight; }, 0);
    var score = rows.reduce(function (a, r) { return a + r.earned; }, 0);

    return { rows: rows, score: Math.round((score / maxScore) * 100) };
  }

  function band(score) {
    if (score >= 90) return { label: "Strong", note: "A machine can identify this page and what it's about without guessing." };
    if (score >= 70) return { label: "Solid", note: "The essentials are in place. The gaps below are worth closing but nothing is broken." };
    if (score >= 45) return { label: "Partial", note: "Enough is missing that a machine has to infer things it shouldn't have to." };
    return { label: "Weak", note: "This page is largely opaque to anything that isn't a human reader." };
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render(data) {
    var b = band(data.score);

    var html =
      '<div class="viz"><div class="viz__head"><p class="viz__title">Readiness score</p></div>' +
      '<div class="hero-figure"><div class="hero-figure__value">' + data.score +
      '<span style="font-size:.4em;color:var(--ink-faint)"> / 100</span></div>' +
      '<div class="hero-figure__label"><strong>' + b.label + ".</strong> " + b.note + "</div></div></div>";

    /* Failures first — the list is a work queue, not a report card. */
    var order = { fail: 0, warn: 1, pass: 2 };
    var sorted = data.rows.slice().sort(function (a, x) {
      if (order[a.result.state] !== order[x.result.state]) return order[a.result.state] - order[x.result.state];
      return x.check.weight - a.check.weight;
    });

    html += '<div class="viz"><div class="viz__head"><p class="viz__title">Checks</p>' +
      '<p class="viz__sub">Failures first, then warnings, weighted by impact.</p></div>' +
      '<div class="geo-checks">';

    sorted.forEach(function (r) {
      var icon = r.result.state === "pass" ? "✓" : r.result.state === "warn" ? "!" : "✕";
      html +=
        '<div class="geo-check geo-check--' + r.result.state + '">' +
        '<div class="geo-check__icon" aria-hidden="true">' + icon + "</div>" +
        "<div><div class=\"geo-check__name\">" + esc(r.check.name) +
        ' <span class="geo-check__group">' + esc(r.check.group) + "</span></div>" +
        '<div class="geo-check__detail">' + esc(r.result.detail) + "</div>" +
        (r.result.fix ? '<div class="geo-check__fix">' + esc(r.result.fix) + "</div>" : "") +
        "</div></div>";
    });

    html += "</div></div>";

    results.innerHTML = html;
    results.removeAttribute("hidden");
    results.setAttribute("tabindex", "-1");
    results.focus();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  run.addEventListener("click", function () {
    var html = input.value.trim();
    if (!html) return;
    render(analyse(html));
  });

  if (clear) {
    clear.addEventListener("click", function () {
      input.value = "";
      results.setAttribute("hidden", "");
      results.innerHTML = "";
      input.focus();
    });
  }

  /* Load this site's own homepage as a worked example. */
  if (sample) {
    sample.addEventListener("click", function () {
      sample.disabled = true;
      sample.textContent = "Loading…";
      fetch("/")
        .then(function (r) { return r.text(); })
        .then(function (text) {
          input.value = text;
          render(analyse(text));
        })
        .catch(function () {
          input.placeholder = "Couldn't load the example — paste your own HTML instead.";
        })
        .finally(function () {
          sample.disabled = false;
          sample.textContent = "Try it on this site";
        });
    });
  }
})();
