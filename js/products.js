/* ==========================================================
   MAG Nails — products page
   ========================================================== */

const ESHOP = "http://ritzy-nails-greece.gr"; // every "Shop now" button goes here

/* ---- Products (files in assets/products)
   cat: builder | base | lac | art   — names are taken from the product labels ---- */
const PRODUCTS = [
  { cat: "builder", name: "Strawberry 05", type: "Premium Builder Gel", text: "A soft strawberry-pink builder gel for strong, natural-looking nails.", img: "assets/products/p01.jpg" },
  { cat: "builder", name: "Easy Shape 2 · Milky White", type: "Builder Gel + Milky Top", text: "Milky white builder gel that shapes easily, finished with Milky Top.", img: "assets/products/p06.jpg" },
  { cat: "base", name: "Premium Strong Base · Ballerina", type: "Base", text: "A strong, self-levelling base in a soft ballerina pink.", img: "assets/products/p03.jpg" },
  { cat: "lac", name: "Ritzy LAC 76 · Carmine Red", type: "Gel Polish", text: "A rich, glossy classic red that suits every season.", img: "assets/products/p05.jpg" },
  { cat: "lac", name: "Miami Collection", type: "Ritzy LAC Gel Polish Set", text: "A summer collection of Ritzy LAC gel polish shades.", img: "assets/products/p02.jpg" },
  { cat: "art", name: "Nail Art", type: "Hand-painted designs", text: "Hand-painted florals and gold foil, created with Ritzy products.", img: "assets/products/p04.jpg" },
  { cat: "builder", name: "Easy Shape 2", type: "Builder Gel", text: "Long, strong almond and stiletto shapes with Easy Shape builder gel.", video: "assets/products/v03.mp4", poster: "assets/products/v03.jpg" },
  { cat: "builder", name: "Easy Shape 2 · Milky White", type: "Builder Gel", text: "The milky white Easy Shape finish, up close.", video: "assets/products/v04.mp4", poster: "assets/products/v04.jpg" },
  { cat: "builder", name: "Ritzy Builder Gels", type: "Builder Gel", text: "Our builder gel jars, ready for strong, lasting nails.", video: "assets/products/v09.mp4", poster: "assets/products/v09.jpg" },
  { cat: "base", name: "Ritzy Base", type: "Base", text: "A creamy rubber base in a natural pink tone.", video: "assets/products/v05.mp4", poster: "assets/products/v05.jpg" },
  { cat: "base", name: "Ritzy Base", type: "Base", text: "See the texture: thick enough to build, smooth to apply.", video: "assets/products/v06.mp4", poster: "assets/products/v06.jpg" },
  { cat: "lac", name: "Ritzy Gel Polish · Mint", type: "Gel Polish", text: "A fresh pastel mint shade.", video: "assets/products/v01.mp4", poster: "assets/products/v01.jpg" },
  { cat: "lac", name: "Ritzy Gel Polish · Pink", type: "Gel Polish", text: "A soft candy pink shade.", video: "assets/products/v02.mp4", poster: "assets/products/v02.jpg" },
  { cat: "lac", name: "Ritzy Glitter Gel Polish", type: "Gel Polish", text: "A sparkling ocean-blue glitter.", video: "assets/products/v07.mp4", poster: "assets/products/v07.jpg" },
  { cat: "lac", name: "Ritzy LAC · Nude", type: "Gel Polish", text: "A milky nude for clean, everyday nails.", video: "assets/products/v08.mp4", poster: "assets/products/v08.jpg" },
];

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $$('[data-config="eshop"]').forEach(a => { a.href = ESHOP; });
  $("#year").textContent = new Date().getFullYear();

  /* logo: inline the symbol so it renders everywhere */
  const symbol = $("#logo");
  $$("svg use[href='#logo']").forEach(use => {
    const svg = use.ownerSVGElement;
    symbol.childNodes.forEach(n => svg.appendChild(n.cloneNode(true)));
    use.remove();
  });

  /* split headings into words for the reveal */
  $$(".split").forEach(el => {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(child => {
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
    walk(el);
  });

  /* product cards */
  const grid = $(".pgrid");
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="pcard reveal" data-cat="${p.cat}" style="--d:${i % 3}">
      <a class="pcard__media" href="${ESHOP}" target="_blank" rel="noopener" aria-label="Shop ${esc(p.name)} on the e-shop">
        ${p.video
          ? `<video muted loop playsinline preload="none" poster="${p.poster}" aria-hidden="true"><source src="${p.video}" type="video/mp4"></video><span class="pcard__badge" aria-hidden="true">▶</span>`
          : `<img src="${p.img}" alt="${esc(p.name)}" loading="lazy" decoding="async">`}
      </a>
      <div class="pcard__body">
        <p class="pcard__type">${esc(p.type)}</p>
        <h2 class="pcard__name">${esc(p.name)}</h2>
        <p class="pcard__text">${esc(p.text)}</p>
        <a class="btn btn--full pcard__btn magnetic" href="${ESHOP}" target="_blank" rel="noopener"><span>Shop now</span><i class="btn__arrow" aria-hidden="true">→</i></a>
      </div>
    </article>`).join("");

  /* reveal on scroll */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in"); io.unobserve(e.target);
  }), { threshold: 0.12 });
  $$(".reveal, .split").forEach(el => io.observe(el));

  /* videos play only while visible */
  const vio = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting && !reduceMotion) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: 0.3 });
  $$(".pcard video").forEach(v => vio.observe(v));

  /* filters */
  const cards = $$(".pcard");
  const chips = $$(".chip");
  chips.forEach(chip => {
    const f = chip.dataset.filter;
    $(".chip__n", chip).textContent = f === "all" ? cards.length : cards.filter(c => c.dataset.cat === f).length;
    chip.addEventListener("click", () => {
      chips.forEach(c => c.setAttribute("aria-pressed", c === chip));
      grid.classList.add("is-filtering");
      setTimeout(() => {
        cards.forEach(c => { c.hidden = !(f === "all" || c.dataset.cat === f); c.classList.add("is-in"); });
        grid.classList.remove("is-filtering");
      }, reduceMotion ? 0 : 250);
    });
  });

  /* scroll progress bar */
  const progress = $(".scroll-progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();
})();
