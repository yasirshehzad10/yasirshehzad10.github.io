(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  /* one gentle rise on scroll, once per element */
  var items = [].slice.call(document.querySelectorAll(".reveal"));
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* email, joined here so it is not sitting in the page source as text */
  [].forEach.call(document.querySelectorAll("a[data-u]"), function (a) {
    var addr = a.getAttribute("data-u") + "@" + a.getAttribute("data-d");
    a.href = "mailto:" + addr;
    if (a.hasAttribute("data-show")) a.textContent = addr;
  });

  /* copy BibTeX */
  [].forEach.call(document.querySelectorAll("[data-bibtex]"), function (b) {
    b.addEventListener("click", function () {
      var el = document.getElementById(b.getAttribute("data-bibtex"));
      if (!el) return;
      var txt = el.textContent.trim();
      var done = function () {
        var old = b.textContent;
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { fallback(txt, done); });
      } else { fallback(txt, done); }
    });
  });
  function fallback(txt, done) {
    var t = document.createElement("textarea");
    t.value = txt; t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(t);
  }
})();
