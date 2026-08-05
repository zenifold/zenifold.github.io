/* Command palette — ⌘K / Ctrl+K.

   The index is fetched lazily on first open, so it costs nothing on pages
   nobody searches from. Navigation is plain <a> semantics underneath, so a
   result is a real link, not a JS-only jump. */

(function () {
  "use strict";

  var overlay = document.getElementById("palette");
  if (!overlay) return;

  var input = overlay.querySelector("[data-palette-input]");
  var list = overlay.querySelector("[data-palette-list]");
  var empty = overlay.querySelector("[data-palette-empty]");
  var countEl = overlay.querySelector("[data-palette-count]");

  var entries = null;
  var loading = false;
  var active = 0;
  var lastFocused = null;

  function load() {
    if (entries || loading) return Promise.resolve();
    loading = true;
    return fetch("/search-index.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        entries = data.entries || [];
        loading = false;
        render("");
      })
      .catch(function () {
        loading = false;
        entries = [];
        if (empty) {
          empty.textContent = "Search index couldn't load.";
          empty.removeAttribute("hidden");
        }
      });
  }

  /* Subsequence match, so "wcup" finds "World Cup" and "opdrag" finds
     "Operational Drag". Scored so earlier and tighter matches rank higher. */
  function score(query, entry) {
    var haystack = (entry.title + " " + entry.type + " " + entry.keywords + " " + entry.desc).toLowerCase();
    var title = entry.title.toLowerCase();

    if (title.indexOf(query) === 0) return 1000;
    if (title.indexOf(query) > -1) return 800 - title.indexOf(query);
    if (haystack.indexOf(query) > -1) return 400 - Math.min(haystack.indexOf(query), 200);

    var qi = 0;
    var firstHit = -1;
    for (var i = 0; i < haystack.length && qi < query.length; i++) {
      if (haystack[i] === query[qi]) {
        if (firstHit === -1) firstHit = i;
        qi++;
      }
    }
    if (qi === query.length) return 200 - Math.min(firstHit, 150);
    return -1;
  }

  function render(query) {
    if (!entries) return;
    var q = query.trim().toLowerCase();

    var matches = entries
      .map(function (e) { return { e: e, s: q ? score(q, e) : 0 }; })
      .filter(function (m) { return m.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 40);

    active = 0;
    list.innerHTML = matches
      .map(function (m, i) {
        var e = m.e;
        return (
          '<li role="option" id="palette-opt-' + i + '" aria-selected="' + (i === 0) + '">' +
          '<a class="palette__item" href="' + e.url + '" tabindex="-1">' +
          '<span class="palette__item-main">' +
          '<span class="palette__item-title">' + e.title + "</span>" +
          (e.desc ? '<span class="palette__item-desc">' + e.desc + "</span>" : "") +
          "</span>" +
          '<span class="palette__item-type">' + e.type + "</span>" +
          "</a></li>"
        );
      })
      .join("");

    if (empty) {
      if (matches.length) empty.setAttribute("hidden", "");
      else empty.removeAttribute("hidden");
    }
    if (countEl) {
      countEl.textContent = matches.length + (matches.length === 1 ? " result" : " results");
    }
    highlight();
  }

  function options() {
    return Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
  }

  function highlight() {
    options().forEach(function (li, i) {
      li.setAttribute("aria-selected", String(i === active));
      if (i === active) {
        input.setAttribute("aria-activedescendant", li.id);
        li.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.removeAttribute("hidden");
    document.documentElement.style.overflow = "hidden";
    input.value = "";
    input.focus();
    load().then(function () { render(""); });
  }

  function close() {
    overlay.setAttribute("hidden", "");
    document.documentElement.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function isOpen() {
    return !overlay.hasAttribute("hidden");
  }

  document.addEventListener("keydown", function (event) {
    var mod = event.metaKey || event.ctrlKey;

    if (mod && event.key.toLowerCase() === "k") {
      event.preventDefault();
      isOpen() ? close() : open();
      return;
    }

    /* "/" opens, but not while typing in a field. */
    if (event.key === "/" && !isOpen()) {
      var tag = (event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || event.target.isContentEditable) return;
      event.preventDefault();
      open();
      return;
    }

    if (!isOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      active = Math.min(active + 1, options().length - 1);
      highlight();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(active - 1, 0);
      highlight();
    } else if (event.key === "Enter") {
      var current = options()[active];
      var link = current && current.querySelector("a");
      if (link) {
        event.preventDefault();
        window.location.href = link.getAttribute("href");
      }
    }
  });

  input.addEventListener("input", function () { render(input.value); });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) close();
  });

  document.querySelectorAll("[data-palette-open]").forEach(function (btn) {
    btn.addEventListener("click", open);
  });

  list.addEventListener("mousemove", function (event) {
    var li = event.target.closest('[role="option"]');
    if (!li) return;
    var i = options().indexOf(li);
    if (i > -1 && i !== active) {
      active = i;
      highlight();
    }
  });
})();
