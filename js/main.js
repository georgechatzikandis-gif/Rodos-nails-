/* ==========================================================
   MAG Nails & Beauty Shop — interactions & animations
   ========================================================== */

/* ---- EDIT YOUR SALON DETAILS HERE ---- */
const CONFIG = {
  treatwell: "https://www.treatwell.gr/katasthma/mag-nails-beauty-shop/", // all bookings go here
  phones: ["+30 22410 69344", "+30 6955 36 9825"], // landline, mobile
  whatsapp: "+30 6955 36 9825",
  email: "",                           // leave empty to hide it
  instagram: "https://instagram.com/", // placeholder: full profile URL
  address: "Street &amp; number<br>Rhodes, Greece", // placeholder
  timeZone: "Europe/Athens",           // the live "open now" status uses the salon's local time
  hours: [ // Monday first; [open, close] in 24h time, or null when closed
    ["Monday",    ["09:00", "20:00"]],
    ["Tuesday",   ["09:00", "20:00"]],
    ["Wednesday", ["09:00", "20:00"]],
    ["Thursday",  ["09:00", "20:00"]],
    ["Friday",    ["12:00", "20:00"]],
    ["Saturday",  ["09:00", "17:00"]],
    ["Sunday",    null],
  ],
};

/* ---- Client reviews (copied from Google & Treatwell) ---- */
const REVIEWS = [
  { name: "Florans Hadzhieva", src: "Google", text: "I want to express how happy I am about my experience with this studio. It has been almost 1.5 months later since I did my gellac manicure and the nails just …" },
  { name: "Treatwell reviewer", src: "Treatwell", text: "Εξαιρετική η Εμιλυ ! Δεν έχω να προσθέσω κάτι , τελειοποιεί και την παραμικρή λεπτομέρεια ! Πολύ ευγενικό κορίτσι επίσης" },
  { name: "Rebeka Elekes", src: "Google", text: "Really happy with my nails, the quality is always so good and they last really well. The girls working there are so lovely and friendly, and they always make …" },
  { name: "Treatwell reviewer", src: "Treatwell", text: "Είχε χαλάσει ένα νύχι μου απ την Αθήνα που είχα πάει και μου το έφτιαξαν πολύ καλά" },
  { name: "Gabriella Somi", src: "Google", text: "Absolutely amazing staff! They are neat and super service oriented. Without a doubt the best pedicure I've ever had...The owner served me coffee and water and is so nice!…" },
  { name: "Treatwell reviewer", src: "Treatwell", text: "Όπως κάθε φορά το αποτέλεσμα ήταν άριστο !Η Ιρίνα είναι καταπληκτική 💕💕" },
  { name: "Eva Tzitzou", src: "Google", text: "Το μαγαζί είναι πραγματικά top! Έκανα manicure με gel σε μεσαίου μήκους νύχια, pedicure και σχήμα φρυδιών σε ένα …" },
  { name: "Anek", src: "Google", text: "Great service and amazing staff! 🥰 I’ve got exactly what I imagined! Thank you Emily for such a great job! Very talented 🌸 I will come back again for sure 🤗" },
  { name: "Christiana Kourtali", src: "Google", text: "Οι κοπέλες ευγενέστατες, τέλεια ατμόσφαιρα. Το καλύτερο Lash lift με διαφορά, τα νύχια ακόμη και σε πολύ κοντό τέλεια. Όλα θετικά γι’αυτο το μαγαζί. Θα το ξανά π…" },
  { name: "Treatwell reviewer", src: "Treatwell", text: "Όλα τέλεια" },
  { name: "Γεωργιαννα Διακοπαναγιωτη", src: "Google", text: "Υπέροχη δουλειά,εξυπηρετικές όλες οι κοπέλες και εδιαθετες με υπέροχο και γαλήνιο κλίμα!!!! 🙏🏼Αξίζειι να πάτε,δεν θα το κετανιώσετε" },
  { name: "Polina Strati", src: "Google", text: "Τα κοριτσια είναι επαγγελματίες και γνωρίζουν πολύ καλά το αντικείμενό τους. Πολύ καθαρό και καλαίσθητο, όλα τα μέτρα τη…" },
  { name: "Thalia Xatzistrati", src: "Google", text: "Πολύ όμορφος και καθαρός χώρος! Η κοπέλα ήταν εξαιρετική, πολύ ευγενική και προσεκτική στη δουλειά της, με …" },
  { name: "fani pokkia", src: "Google", text: "Καλή δουλειά και ευχάριστο περιβάλλον!…" },
  { name: "Svetlana M.", src: "Google", text: "I recently visited this salon for a French manicure and pedicure, and it was the best experience I've ever had! ❤❤❤❤The quality of both the manicure and …" },
  { name: "Popi Pampali", src: "Google", text: "Εξαιρετική εμπειρία! Ο χώρος είναι καθαρός, προσεγμένος και πολύ φιλόξενος. Η εξυπηρέτηση άψογη και το αποτέλεσμα στα νύχια μου πραγματικά εντυπωσιακό – μεγάλη …" },
  { name: "4aHoliday Ltd", src: "Google", text: "⭐️⭐️⭐️⭐️⭐️" },
  { name: "Ivelina Beneva", src: "Google", text: "Adorable, cozy, friendly nails salon with the most calmly and relaxed atmosphere ever. The owner Mariana and her staff treated me as a princess and I really enjoyed the time …" },
  { name: "Kristian Dimitrov", src: "Google", text: "⭐️⭐️⭐️⭐️⭐️" },
  { name: "Frida Lindström", src: "Google", text: "Been trying several different places around Rhodes but this is definitely the best one! …" },
  { name: "Zoi Parsalidou", src: "Google", text: "⭐️⭐️⭐️⭐️⭐️" },
];

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Fill contact details ---------- */
  $$('[data-config="phones"]').forEach(el => { el.innerHTML = CONFIG.phones.map(n => `<a href="tel:${n.replace(/[^\d+]/g, "")}">${n}</a>`).join("<br>"); });
  if (CONFIG.email) $$('[data-config="email"]').forEach(a => { a.textContent = CONFIG.email; a.href = "mailto:" + CONFIG.email; });
  else $$('[data-optional="email"]').forEach(el => el.remove());
  $$('[data-config="instagram"]').forEach(a => { a.href = CONFIG.instagram; });
  $$('[data-config="treatwell"]').forEach(a => { a.href = CONFIG.treatwell; });
  $$('[data-config="whatsapp"]').forEach(a => { a.href = `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello!")}`; });
  $$('[data-config="address"]').forEach(p => { p.innerHTML = CONFIG.address; });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Reviews: two rows of cards scrolling in opposite directions ---------- */
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const card = r => `
    <figure class="rv">
      <div class="rv__top"><span class="rv__stars" aria-label="5 out of 5 stars">★★★★★</span><span class="rv__src rv__src--${r.src.toLowerCase()}">${r.src}</span></div>
      <blockquote class="rv__text">${esc(r.text)}</blockquote>
      <figcaption class="rv__name"><span class="rv__avatar" aria-hidden="true">${esc([...r.name][0].toUpperCase())}</span>${esc(r.name)}</figcaption>
    </figure>`;
  $$(".rv-track").forEach((track, row) => {
    const items = REVIEWS.filter((_, i) => i % 2 === row).map(card).join("");
    // second copy makes the loop seamless; hidden from screen readers
    track.innerHTML = `<div class="rv-group">${items}</div><div class="rv-group" aria-hidden="true">${items}</div>`;
    track.style.setProperty("--dur", `${REVIEWS.length * 6}s`);
  });
  const countIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const b = $("[data-count]", e.target), end = +b.dataset.count, t0 = performance.now();
    if (reduceMotion) return;
    const tick = t => {
      const k = Math.min(1, (t - t0) / 1800);
      b.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  $$(".rating").forEach(el => countIO.observe(el));

  /* ---------- Live opening hours ---------- */
  const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmtDur = m => {
    const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), min = m % 60;
    return [d && `${d} d`, h && `${h} h`, !d && min && `${min} min`].filter(Boolean).join(" ") || "less than a minute";
  };
  const salonNow = () => {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: CONFIG.timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    return { day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")), mins: +get("hour") * 60 + +get("minute"), hhmm: `${get("hour")}:${get("minute")}` };
  };

  // build the weekly timeline once
  const openDays = CONFIG.hours.filter(([, h]) => h);
  const axisStart = Math.floor(Math.min(...openDays.map(([, h]) => toMin(h[0]))) / 60) - 1;
  const axisEnd = Math.ceil(Math.max(...openDays.map(([, h]) => toMin(h[1]))) / 60) + 1;
  const span = (axisEnd - axisStart) * 60;
  const pos = m => ((m - axisStart * 60) / span) * 100;
  const week = $(".week");
  week.style.setProperty("--hours", axisEnd - axisStart);
  $(".week__axis").innerHTML = Array.from({ length: axisEnd - axisStart + 1 }, (_, i) => axisStart + i)
    .filter(h => (h - axisStart) % 2 === 0)
    .map(h => `<span style="left:${pos(h * 60)}%">${String(h).padStart(2, "0")}:00</span>`).join("");
  $(".week__days").innerHTML = CONFIG.hours.map(([name, h], i) => `
    <div class="day${h ? "" : " is-closed"}" style="--i:${i}">
      <span class="day__name"><span class="day__full">${name}</span><span class="day__short">${name.slice(0, 3)}</span></span>
      <div class="day__track">${h ? `<span class="day__bar" style="left:${pos(toMin(h[0]))}%;width:${pos(toMin(h[1])) - pos(toMin(h[0]))}%"></span>` : ""}<span class="day__now"></span></div>
      <span class="day__time">${h ? `${h[0]} – ${h[1]}` : "Closed"}</span>
    </div>`).join("");
  const dayRows = $$(".day");
  const statusEl = $(".status");
  const ringFill = $(".status__fill");
  const ringLen = 2 * Math.PI * 100;
  ringFill.style.strokeDasharray = ringLen;

  const updateHours = () => {
    const now = salonNow();
    const today = CONFIG.hours[now.day][1];
    let state, label, detail, count, progress = 0;
    if (today && now.mins >= toMin(today[0]) && now.mins < toMin(today[1])) {
      const o = toMin(today[0]), c = toMin(today[1]), left = c - now.mins;
      state = left <= 60 ? "closing" : "open";
      label = left <= 60 ? "Closing soon" : "Open now";
      detail = `Today until ${today[1]}`;
      count = `Closes in ${fmtDur(left)}`;
      progress = (now.mins - o) / (c - o);
    } else {
      state = "closed"; label = "Closed now";
      for (let k = 0; k <= 7; k++) {
        const d = (now.day + k) % 7, h = CONFIG.hours[d][1];
        if (!h || (k === 0 && now.mins >= toMin(h[0]))) continue;
        detail = `Opens ${k === 0 ? "today" : k === 1 ? "tomorrow" : CONFIG.hours[d][0]} at ${h[0]}`;
        count = `in ${fmtDur(k * 1440 + toMin(h[0]) - now.mins)}`;
        break;
      }
    }
    statusEl.dataset.state = state;
    $(".status__text").textContent = label;
    $(".status__detail").textContent = detail;
    $(".status__count").textContent = count;
    $(".status__clock b").textContent = now.hhmm;
    ringFill.style.strokeDashoffset = ringLen * (1 - progress);
    dayRows.forEach((row, i) => {
      row.classList.toggle("is-today", i === now.day);
      const marker = $(".day__now", row);
      const p = pos(now.mins);
      marker.hidden = i !== now.day || p < 0 || p > 100;
      marker.style.left = p + "%";
    });
  };
  updateHours();
  setInterval(updateHours, 20000);

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
  const waFloat = $(".wa-float");
  const bookCard = $(".book__card");
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
    const fr = bookCard.getBoundingClientRect(); // keep the Treatwell button clear
    waFloat.classList.toggle("is-visible", y > vh - 80 && !(fr.top < innerHeight && fr.bottom > 0));
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

})();
