/* Chart interaction: hover tooltips and the table view.

   An HTML chart is interactive by default, so every mark carries a tooltip and
   every chart carries a table fallback — the table is what makes the data
   available when colour or hover isn't (keyboard, screen reader, print). */

(function () {
  "use strict";

  var tooltip = null;

  function ensureTooltip() {
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.className = "viz-tooltip";
    tooltip.setAttribute("role", "status");
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function show(target, event) {
    var label = target.getAttribute("data-label");
    var value = target.getAttribute("data-value");
    var note = target.getAttribute("data-note");
    if (!label && !value) return;

    var el = ensureTooltip();
    var html = "";
    if (label) html += '<div>' + label + "</div>";
    if (value) html += '<div class="viz-tooltip__value">' + value + "</div>";
    if (note) html += "<div>" + note + "</div>";
    el.innerHTML = html;
    el.classList.add("is-visible");
    position(el, event, target);
  }

  function position(el, event, target) {
    var x, y;
    if (event && typeof event.clientX === "number") {
      x = event.clientX;
      y = event.clientY;
    } else {
      /* Keyboard focus has no pointer — anchor to the mark itself. */
      var box = target.getBoundingClientRect();
      x = box.left + box.width / 2;
      y = box.top;
    }
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    var left = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8);
    var top = y - h - 12;
    if (top < 8) top = y + 18;
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function hide() {
    if (tooltip) tooltip.classList.remove("is-visible");
  }

  function bindMarks(scope) {
    (scope || document).querySelectorAll("[data-viz-mark]").forEach(function (mark) {
      if (mark.dataset.vizBound) return;
      mark.dataset.vizBound = "1";

      /* Focusable so the tooltip is reachable without a pointer. */
      if (!mark.hasAttribute("tabindex")) mark.setAttribute("tabindex", "0");

      mark.addEventListener("mouseenter", function (e) { show(mark, e); });
      mark.addEventListener("mousemove", function (e) { show(mark, e); });
      mark.addEventListener("mouseleave", hide);
      mark.addEventListener("focus", function () { show(mark, null); });
      mark.addEventListener("blur", hide);
    });
  }

  bindMarks(document);

  /* Exposed so pages that inject charts after load (the assessment) can bind
     tooltips on the new marks without duplicating this logic. */
  window.vizBindMarks = bindMarks;

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hide();
  });

  window.addEventListener("scroll", hide, { passive: true });

  /* Table view toggle */
  document.querySelectorAll("[data-viz-table-toggle]").forEach(function (btn) {
    var table = document.getElementById(btn.getAttribute("aria-controls"));
    if (!table) return;

    btn.addEventListener("click", function () {
      var open = table.hasAttribute("hidden");
      if (open) table.removeAttribute("hidden");
      else table.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Hide data table" : "Show data table";
    });
  });

  /* Career chart lane filter. Hides lanes only — every bar ships visible, so
     the chart is complete without JS. */
  var ganttChips = document.querySelectorAll("[data-gantt-filter]");
  if (ganttChips.length) {
    var lanes = document.querySelectorAll("[data-gantt-lane]");

    ganttChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-gantt-filter");

        lanes.forEach(function (lane) {
          var match = filter === "all" || lane.getAttribute("data-gantt-lane") === filter;
          if (match) lane.removeAttribute("hidden");
          else lane.setAttribute("hidden", "");
        });

        ganttChips.forEach(function (c) {
          c.setAttribute("aria-pressed", String(c.getAttribute("data-gantt-filter") === filter));
        });
      });
    });
  }

  /* Tabbed views. Follows the ARIA tabs pattern: arrow keys move between tabs,
     and the panel is only revealed by the selected tab. */
  document.querySelectorAll("[data-viz-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll(".viz-tab"));
    if (!tabs.length) return;

    function select(index) {
      tabs.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute("aria-selected", String(selected));
        tab.setAttribute("tabindex", selected ? "0" : "-1");
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) {
          if (selected) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        }
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (next === null) return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
      });
    });

    select(0);
  });

  /* Grow bars from zero once they scroll into view. Widths are already set
     inline, so this is decoration only — nothing depends on JS to be correct. */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fills = document.querySelectorAll(".bar-row__fill, .meter__fill");

  if (!reduce && "IntersectionObserver" in window && fills.length) {
    fills.forEach(function (f) {
      f.dataset.finalWidth = f.style.width;
      f.style.width = "0%";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.dataset.finalWidth;
        io.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    fills.forEach(function (f) { io.observe(f); });
  }
})();
