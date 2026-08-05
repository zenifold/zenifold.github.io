/* Category filter for product and post grids.

   Progressive enhancement: the markup ships with every card visible, so the
   page is complete without this file. The buttons only ever hide things. */

(function () {
  "use strict";

  var scope = document.querySelector("[data-filter-scope]");
  var chips = document.querySelectorAll(".filter-chip[data-filter]");
  var counter = document.querySelector("[data-filter-count]");
  if (!scope || !chips.length) return;

  var cards = scope.querySelectorAll("[data-category]");
  var noun = scope.classList.contains("product-grid") ? "product" : "post";

  function apply(filter) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = filter === "all" || card.getAttribute("data-category") === filter;
      if (match) {
        card.removeAttribute("hidden");
        shown++;
      } else {
        card.setAttribute("hidden", "");
      }
    });

    chips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("data-filter") === filter));
    });

    if (counter) {
      counter.textContent = shown + " " + noun + (shown === 1 ? "" : "s");
    }

    /* Reflect the filter in the URL so a filtered view can be linked and
       survives a reload. replaceState keeps it out of the back-button history. */
    var url = new URL(window.location.href);
    if (filter === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", filter);
    window.history.replaceState({}, "", url);
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      apply(chip.getAttribute("data-filter"));
    });
  });

  /* Honour ?category= on load. */
  var initial = new URL(window.location.href).searchParams.get("category");
  if (initial) {
    var known = Array.prototype.some.call(chips, function (c) {
      return c.getAttribute("data-filter") === initial;
    });
    if (known) apply(initial);
  }
})();
