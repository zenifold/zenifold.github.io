/* Long-form reading aids: progress bar, scroll-spy table of contents, and
   linkable heading anchors.

   All three are generated from the rendered headings rather than declared in
   front matter, so a post can't fall out of sync with its own contents. */

(function () {
  "use strict";

  var article = document.querySelector("[data-reading]");
  if (!article) return;

  /* ---- Heading anchors ---------------------------------------------------- */

  function slug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  var headings = Array.prototype.slice.call(article.querySelectorAll("h2"));
  var used = {};

  headings.forEach(function (h) {
    if (!h.id) {
      var base = slug(h.textContent) || "section";
      used[base] = (used[base] || 0) + 1;
      h.id = used[base] > 1 ? base + "-" + used[base] : base;
    }

    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.appendChild(a);
  });

  /* ---- Progress bar ------------------------------------------------------- */

  var bar = document.querySelector("[data-read-progress]");

  function updateProgress() {
    if (!bar) return;
    var box = article.getBoundingClientRect();
    var total = article.offsetHeight - window.innerHeight;
    if (total <= 0) {
      bar.style.width = "0%";
      return;
    }
    var scrolled = -box.top;
    var pct = Math.max(0, Math.min(100, (scrolled / total) * 100));
    bar.style.width = pct + "%";
  }

  /* ---- Table of contents -------------------------------------------------- */

  var tocMount = document.querySelector("[data-toc]");
  var links = [];

  if (tocMount && headings.length > 2) {
    var ul = document.createElement("ul");
    ul.className = "toc__list";

    headings.forEach(function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      /* Strip the trailing anchor glyph from the label. */
      a.textContent = h.textContent.replace(/#$/, "").trim();
      li.appendChild(a);
      ul.appendChild(li);
      links.push(a);
    });

    tocMount.appendChild(ul);
    tocMount.removeAttribute("hidden");
  }

  /* Scroll-spy: mark the heading whose section the reader is currently in. */
  function updateSpy() {
    if (!links.length) return;
    var current = 0;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 120) current = i;
      else break;
    }
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      updateSpy();
      queued = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
