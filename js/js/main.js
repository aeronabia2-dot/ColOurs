(function () {
  "use strict";

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Header shadow on scroll
  var header = document.getElementById("siteHeader");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Close mobile menu after choosing a link
  var navCollapse = document.getElementById("mainNav");
  document.querySelectorAll("#mainNav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      if (navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  // Highlight the nav link of the section in view
  var links = Array.prototype.slice.call(document.querySelectorAll("#mainNav .nav-link"));
  var map = {};
  links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
  var targets = ["home", "about", "focus", "community", "resources", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
          var active = map[entry.target.id];
          if (active) { active.classList.add("active"); active.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  // Resource modal title
  var resourceModal = document.getElementById("resourceModal");
  resourceModal.addEventListener("show.bs.modal", function (e) {
    var trigger = e.relatedTarget;
    var title = trigger && trigger.getAttribute("data-resource");
    document.getElementById("resourceTitle").textContent = title || "Resource";
  });

  // Join form: validates, then opens the visitor's email app
  // addressed to the community inbox. Swap this for a fetch() call
  // to your backend (e.g. PHP endpoint) when you have one.
  var form = document.getElementById("joinForm");
  var hint = document.getElementById("joinHint");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("joinName");
    var email = document.getElementById("joinEmail");
    var note = document.getElementById("joinNote");

    name.classList.toggle("is-invalid", !name.value.trim());
    email.classList.toggle("is-invalid", !email.validity.valid || !email.value.trim());
    if (!name.value.trim() || !email.validity.valid || !email.value.trim()) return;

    var subject = encodeURIComponent("Join ColOurs: " + name.value.trim());
    var body = encodeURIComponent(
      "Name: " + name.value.trim() +
      "\nEmail: " + email.value.trim() +
      "\n\nWhy I would like to join:\n" + note.value.trim()
    );
    window.location.href = "mailto:hello@colours.community?subject=" + subject + "&body=" + body;
    hint.textContent = "Thank you. Your email app should open so you can send your request.";
    form.reset();
  });
  form.addEventListener("input", function (e) {
    e.target.classList.remove("is-invalid");
  });
  document.getElementById("joinModal").addEventListener("hidden.bs.modal", function () {
    hint.textContent = "";
  });

  // If a photo is missing, hide the broken-image icon and keep the colored placeholder
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.visibility = "hidden"; });
  });

  // Back to top: focus the page start for keyboard users when jumping home
  var homeLinks = document.querySelectorAll('a[href="#home"]');
  homeLinks.forEach(function (a) {
    a.addEventListener("click", function () {
      var home = document.getElementById("home");
      home.setAttribute("tabindex", "-1");
      home.focus({ preventScroll: true });
    });
  });
})();
