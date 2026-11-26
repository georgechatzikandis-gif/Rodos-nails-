/* ==========================================================
   MAG Nails & Beauty Shop — interactions & animations
   ========================================================== */

/* ---- EDIT YOUR SALON DETAILS HERE ----
   These are placeholders. Replace them with the real details. */
const CONFIG = {
  phones: ["+30 22410 69344", "+30 6955 36 9825"], // landline, mobile
  email: "hello@example.com",          // booking requests are emailed here
  instagram: "https://instagram.com/", // full profile URL
  address: "Street &amp; number<br>Rhodes, Greece",
  hours: [ // Monday first
    ["Monday", "10:00 – 20:00"],
    ["Tuesday", "10:00 – 20:00"],
    ["Wednesday", "10:00 – 20:00"],
    ["Thursday", "10:00 – 20:00"],
    ["Friday", "10:00 – 20:00"],
    ["Saturday", "10:00 – 16:00"],
    ["Sunday", "Closed"],
  ],
};

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Fill contact details ---------- */
  $$('[data-config="phones"]').forEach(el => { el.innerHTML = CONFIG.phones.map(n => `<a href="tel:${n.replace(/[^\d+]/g, "")}">${n}</a>`).join("<br>"); });
  $$('[data-config="email"]').forEach(a => { a.textContent = CONFIG.email; a.href = "mailto:" + CONFIG.email; });
  $$('[data-config="instagram"]').forEach(a => { a.href = CONFIG.instagram; });
  $$('[data-config="address"]').forEach(p => { p.innerHTML = CONFIG.address; });
  const today = (new Date().getDay() + 6) % 7;
  $$('[data-config="hours"]').forEach(ul => {
    ul.innerHTML = CONFIG.hours.map(([d, h], i) => `<li class="${i === today ? "is-today" : ""}"><span>${d}</span><span>${h}</span></li>`).join("");
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Inline the logo into each SVG so every copy animates on its own ---------- */
  const symbol = $("#logo");
  $$("svg use[href='#logo']").forEach(use => {
    const svg = use.ownerSVGElement;
    symbol.childNodes.forEach(n => svg.appendChild(n.cloneNode(true)));
    use.remove();
  });
  const measureLogo = svg => $$(".lg-strike, .lg-tail, .lg-box", svg).forEach(p => {
    try { p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 2); } catch (e) {}
  });
  $$(".logo-anim").forEach(measureLogo);

  /* ---------- Split headings into words ---------- */
  $$(".split").forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
  });

  /* ---------- Preloader ---------- */
  const loader = $(".loader");
  requestAnimationFrame(() => $(".logo-anim", loader).classList.add("is-drawn"));
  const start = performance.now();
  const finishLoading = () => {
    const wait = reduceMotion ? 0 : Math.max(0, 2300 - (performance.now() - start));
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");
      introIO.observe(intro);
      setTimeout(() => loader.remove(), 1300);
    }, wait);
  };

  /* ---------- Hero video ---------- */
  const video = $(".video-hero__video");
  if (reduceMotion) { video.autoplay = false; video.pause(); }
  else video.play().catch(() => {}); // some browsers need a nudge even when muted

  /* ---------- Intro (logo + headline) plays when scrolled into view ---------- */
  const intro = $(".hero");
  const introIO = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    intro.classList.add("is-ready");
    $(".hero__logo").classList.add("is-drawn");
    introIO.disconnect();
  }, { threshold: 0.3 });

  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading);
  setTimeout(() => !document.body.classList.contains("is-loaded") && finishLoading(), 5000); // safety

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      if (e.target.classList.contains("logo-anim")) e.target.classList.add("is-drawn");
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .split, .logo-anim--scroll").forEach(el => io.observe(el));

  /* ---------- Service tabs ---------- */
  const tabs = $$(".tab");
  const indicator = $(".tabs__indicator");
  const moveIndicator = tab => {
    indicator.style.width = tab.offsetWidth + "px";
    indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
  };
  const showPanel = name => {
    $$(".menu").forEach(m => {
      const on = m.dataset.panel === name;
      m.classList.toggle("is-active", on);
      m.classList.remove("is-shown");
      if (on) {
        $$(".menu__item", m).forEach((it, i) => it.style.setProperty("--i", i));
        void m.offsetWidth; // restart animation
        m.classList.add("is-shown");
      }
    });
  };
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => { t.classList.toggle("is-active", t === tab); t.setAttribute("aria-selected", t === tab); });
    moveIndicator(tab);
    showPanel(tab.dataset.tab);
  }));
  const menuIO = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { showPanel($(".tab.is-active").dataset.tab); menuIO.disconnect(); }
  }, { threshold: 0.1 });
  menuIO.observe($(".services"));
  const syncIndicator = () => moveIndicator($(".tab.is-active"));
  window.addEventListener("resize", syncIndicator);
  document.fonts?.ready.then(() => { syncIndicator(); $$(".logo-anim").forEach(measureLogo); });
  syncIndicator();

  /* ---------- Nav: scrolled state, hide on scroll down, mobile menu ---------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const setMenu = open => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$(".nav__links a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

  /* ---------- Scroll-driven effects ---------- */
  const progress = $(".scroll-progress");
  const blobs = $$(".blob");
  const videoHero = $(".video-hero");
  const steps = $(".steps");
  const stepLine = $(".steps__line");
  const stepItems = $$(".step");
  let lastY = scrollY, ticking = false;

  const onScroll = () => {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    nav.classList.toggle("is-scrolled", y > 40);
    // keep the nav off the video; after it, hide on scroll down and show on scroll up
    const vh = videoHero.offsetHeight;
    if (!nav.classList.contains("is-open")) nav.classList.toggle("is-hidden", y < vh - 80 || (y > lastY && y > vh + 400));
    lastY = y;

    if (!reduceMotion) blobs.forEach(b => b.style.transform = `translate3d(0, ${(y - intro.offsetTop) * b.dataset.depth}px, 0)`);

    // process line fills as you scroll through it
    const r = steps.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
    stepLine.style.setProperty("--p", p);
    stepItems.forEach((s, i) => s.classList.toggle("is-lit", p >= (i / (stepItems.length - 1)) * 0.95));
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Custom cursor & magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    const dot = $(".cursor"), ring = $(".cursor-ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    dot.style.visibility = ring.style.visibility = "hidden";
    addEventListener("mousemove", () => { dot.style.visibility = ring.style.visibility = ""; }, { once: true });
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px, ${my}px)`; });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, .nail, .menu__item, select, input, textarea").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });

    $$(".magnetic").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => el.style.transform = "");
    });

    // spotlight inside the about frame
    const frame = $(".about__frame");
    frame.addEventListener("mousemove", e => {
      const r = frame.getBoundingClientRect();
      frame.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      frame.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }

  /* ---------- Booking form ---------- */
  const form = $(".form");
  const status = $(".form__status");
  const dateInput = $("#f-date");
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    $$("[required]", form).forEach(f => {
      const bad = !f.value.trim();
      f.closest(".field").classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = "Please fill in the highlighted fields."; return; }

    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.name}\nPhone: ${d.phone}\nService: ${d.service}\nPreferred date: ${d.date}\nNotes: ${d.notes || "-"}`;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Appointment request — " + d.service)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Thank you! Your email app will open so you can send the request.";
    form.reset();
  });
  $$("input, select, textarea", form).forEach(f => f.addEventListener("input", () => f.closest(".field").classList.remove("is-invalid")));
})();
