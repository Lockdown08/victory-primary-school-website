// Phone menu: open/close, close on Escape or when a link is tapped.
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".menu-toggle__label").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
  window.matchMedia("(min-width: 64em)").addEventListener("change", function (mq) {
    if (mq.matches) setOpen(false);
  });
})();

// Timeline (About): the gold line runs from the first dot to "now",
// and the "We are here" tag shows the current year.
(function () {
  var timeline = document.querySelector(".timeline");
  if (!timeline) return;
  var track = timeline.querySelector(".timeline__track");
  var dots = timeline.querySelectorAll(".timeline__dot");
  var now = timeline.querySelector(".is-now .timeline__dot");
  var year = timeline.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
  if (!track || !dots.length || !now) return;

  function centre(el) {
    var box = el.getBoundingClientRect();
    return box.top + box.height / 2 - timeline.getBoundingClientRect().top;
  }
  function measure() {
    var top = centre(dots[0]);
    track.style.setProperty("--track-top", top + "px");
    track.style.setProperty("--track-h", centre(now) - top + "px");
  }
  measure();
  window.addEventListener("resize", measure);
  if (document.fonts) document.fonts.ready.then(measure);
})();

// Events: mark the current term, past events and the next event, from today's date.
(function () {
  var events = document.querySelectorAll(".event[data-date]");
  if (!events.length) return;
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  function day(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  var next = null;
  events.forEach(function (ev) {
    if (day(ev.dataset.date) < today) ev.classList.add("is-past");
    else if (!next) next = ev;
  });
  if (next) next.classList.add("is-next");

  document.querySelectorAll(".terms [data-start]").forEach(function (term) {
    if (day(term.dataset.start) <= today && today <= day(term.dataset.end)) {
      term.classList.add("is-current");
      var link = term.querySelector("a");
      var tag = document.createElement("span");
      tag.className = "live-tag";
      tag.textContent = "This term";
      link.appendChild(tag);
      link.setAttribute("aria-current", "date");
    }
  });
})();

// Gallery: filter by category, and view photos full size one at a time.
(function () {
  var gallery = document.querySelector(".gallery");
  if (!gallery) return;
  var items = Array.prototype.slice.call(gallery.querySelectorAll("li"));
  var buttons = document.querySelectorAll(".filters button");
  var dialog = document.querySelector(".lightbox");
  var big = dialog && dialog.querySelector("img");
  var count = dialog && dialog.querySelector(".lightbox__count");
  var current = 0;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.filter;
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      items.forEach(function (li) {
        li.hidden = cat !== "all" && li.dataset.cat !== cat;
      });
    });
  });

  if (!dialog || !dialog.showModal) return; // links still open the photo on their own

  function visible() {
    return items.filter(function (li) { return !li.hidden; });
  }
  function show(i) {
    var list = visible();
    current = (i + list.length) % list.length;
    var link = list[current].querySelector("a");
    big.src = link.href;
    big.alt = link.querySelector("img").alt;
    count.textContent = link.dataset.label + " · " + (current + 1) + " of " + list.length;
  }

  gallery.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;
    e.preventDefault();
    show(visible().indexOf(link.parentNode));
    dialog.showModal();
    document.body.classList.add("lightbox-open");
  });
  // Tidy up straight away rather than waiting for the dialog's "close" event,
  // which some browsers don't fire reliably.
  function closeViewer() {
    if (dialog.open) dialog.close();
    document.body.classList.remove("lightbox-open");
    big.removeAttribute("src");
  }
  dialog.addEventListener("close", closeViewer);
  dialog.addEventListener("cancel", function (e) {
    e.preventDefault();
    closeViewer();
  });
  // Tapping the dark area around the photo closes it
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog || e.target.tagName === "FIGURE") closeViewer();
  });
  dialog.querySelector("[data-prev]").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector("[data-next]").addEventListener("click", function () { show(current + 1); });
  dialog.querySelector("[data-close]").addEventListener("click", closeViewer);
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  // Swipe left or right on a phone
  var startX = null;
  dialog.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

// Contact form: send without leaving the page, and say whether it worked.
(function () {
  var form = document.querySelector("form[data-send]");
  if (!form) return;
  var btn = form.querySelector("button[type=submit]");
  var status = form.querySelector(".form__status");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = "Sending…";
    status.hidden = true;
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = "form__status form__status--ok";
        status.textContent = "Thank you, your message has been sent. We'll be in touch soon.";
      })
      .catch(function () {
        status.className = "form__status form__status--error";
        status.innerHTML = 'Sorry, something went wrong. Please try again, or call us on <a href="tel:+27699361866">069 936 1866</a>.';
      })
      .then(function () {
        status.hidden = false;
        btn.disabled = false;
        btn.textContent = "Send message";
      });
  });
})();
