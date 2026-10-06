/* Vista Oceans — interactions */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  var stickyCta = document.getElementById("stickyCta");

  /* Header state + sticky CTA visibility on scroll */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle("scrolled", y > 40);

    var contact = document.getElementById("contact");
    var past = y > window.innerHeight * 0.9;
    var nearContact = false;
    if (contact) {
      var r = contact.getBoundingClientRect();
      nearContact = r.top < window.innerHeight * 0.7;
    }
    stickyCta.classList.toggle("visible", past && !nearContact);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Preview hosts (e.g. *.pages.dev) have no form backend: acknowledge
     gracefully instead of POSTing into the void. Production hosts with a
     real backend (Netlify Forms) are untouched. */
  if (/\.pages\.dev$/.test(window.location.hostname)) {
    var previewForm = document.querySelector('form[name="consultation"]');
    if (previewForm) {
      previewForm.addEventListener("submit", function (e) {
        e.preventDefault();
        previewForm.innerHTML =
          '<p class="form-note" style="font-size:1.1rem">Thanks — we\'ll reply within one business day.</p>';
      });
    }
  }
})();
