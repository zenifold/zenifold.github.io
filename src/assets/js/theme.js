/* Theme toggle.

   The stored preference is applied by an inline script in <head> before first
   paint — this file only handles the button and keeping the label in sync. */

(function () {
  "use strict";

  var buttons = document.querySelectorAll("[data-theme-toggle]");
  if (!buttons.length) return;

  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function effective() {
    var stored = document.documentElement.getAttribute("data-theme");
    if (stored === "dark" || stored === "light") return stored;
    return media.matches ? "dark" : "light";
  }

  function sync() {
    var mode = effective();
    var next = mode === "dark" ? "light" : "dark";
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      btn.setAttribute("title", "Switch to " + next + " theme");
      /* Show the icon for what you'd get, not what you have. */
      btn.setAttribute("data-mode", mode);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = effective() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  });

  /* If the user hasn't chosen explicitly, follow the OS when it changes. */
  media.addEventListener("change", function () {
    var stored = null;
    try { stored = localStorage.getItem("theme"); } catch (e) {}
    if (!stored) sync();
  });

  sync();
})();
