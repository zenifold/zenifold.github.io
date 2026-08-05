/* Mobile menu, dropdown, and footer year. */

(function () {
  "use strict";

  var header = document.querySelector(".site-header__inner");
  var nav = document.getElementById("nav");
  var navToggle = document.querySelector(".nav-toggle");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* On desktop the dropdown opens on hover (CSS). On touch/narrow screens the
     button toggles it, so it also has to work without a hover state. */
  document.querySelectorAll("[data-dropdown]").forEach(function (item) {
    var toggle = item.querySelector(".nav__toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      var open = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll("[data-dropdown].is-open").forEach(function (item) {
      item.classList.remove("is-open");
      item.querySelector(".nav__toggle").setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (header && header.contains(event.target)) return;
    document.querySelectorAll("[data-dropdown].is-open").forEach(function (item) {
      item.classList.remove("is-open");
      item.querySelector(".nav__toggle").setAttribute("aria-expanded", "false");
    });
  });

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Mark the current page in the nav.

     Match exactly, not by prefix. A prefix match on /work/zero-to-one/ also
     matches /work/ ("Explore Everything"), so several links claim to be the
     current page at once — wrong for screen readers, and it used to render
     them invisible inside the blue dropdown. */
  var path = window.location.pathname.replace(/index\.html$/, "");
  if (path.length > 1 && path.charAt(path.length - 1) !== "/") path += "/";

  document.querySelectorAll(".nav a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href.charAt(0) !== "/") return;
    if (href !== path) return;

    link.setAttribute("aria-current", "page");

    /* Highlight the parent "Areas of Work" toggle without claiming it is
       itself the current page. */
    var section = link.closest("[data-dropdown]");
    if (section) section.classList.add("is-current-section");
  });
})();
