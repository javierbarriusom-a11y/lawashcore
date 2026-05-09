const slides = window.DECK_SLIDES || [];

const deck = document.getElementById("deck");
const counter = document.getElementById("counter");
const progress = document.getElementById("progress");
const sectionName = document.getElementById("sectionName");
let current = Math.max(0, Math.min(slides.length - 1, Number(location.hash.replace("#slide-", "")) - 1 || 0));

function safe(text) {
  return String(text || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function lines(text) {
  return safe(text).replace(/\n/g, "<br>");
}

function titleBlock(slide, small = false) {
  return `
    <div class="copy">
      ${slide.eyebrow ? `<p class="eyebrow">${lines(slide.eyebrow)}</p>` : ""}
      ${slide.title ? `<h1 class="title ${small ? "small" : ""}">${lines(slide.title)}</h1>` : ""}
      ${slide.subtitle ? `<p class="subtitle">${lines(slide.subtitle)}</p>` : ""}
    </div>`;
}

function header(slide, i) {
  return `
    <div class="slide-head">
      <div class="mark"><img src="assets/source-media/image4.png" alt="La Wash"></div>
      <div class="head-meta">${safe(slide.section || "Core")}</div>
      <div class="head-count">${String(i + 1).padStart(2, "0")} / ${slides.length}</div>
    </div>`;
}

function footer(slide) {
  const footText = slide.foot === false ? "" : (slide.foot ? lines(slide.foot) : "La Wash Core · Producto core · franquicia de lavanderías autoservicio");
  return `<div class="slide-foot">
    <div>${footText}</div>
    <div class="footer-nav" aria-label="Navegación de diapositivas">
      <button type="button" data-footer-nav="home">Inicio</button><span>·</span>
      <button type="button" data-footer-nav="prev">Atrás</button><span>·</span>
      <button type="button" data-footer-nav="next">Siguiente</button>
    </div>
  </div>`;
}

function renderStats(stats = [], compact = false) {
  return `<div class="stats ${compact ? "compact" : ""}">${stats.map((stat) => `
    <article class="stat">
      ${stat[2] ? `<img class="stat-icon" src="${safe(stat[2])}" alt="">` : ""}
      <strong>${lines(stat[0])}</strong>
      ${stat[1] ? `<span>${lines(stat[1])}</span>` : ""}
    </article>`).join("")}</div>`;
}

function renderAction(action) {
  if (!action) return "";
  return `<a class="hero-action" href="${safe(action[1])}" target="_blank" rel="noopener">${lines(action[0])}</a>`;
}

function renderCards(cards = [], className = "") {
  return `<div class="cards ${className}">${cards.map((card) => `
    <article class="card">
      <h3>${lines(card[0])}</h3>
      ${card[1] ? `<p>${lines(card[1])}</p>` : ""}
    </article>`).join("")}</div>`;
}

function renderProcess(slide) {
  return `<div class="stack process-wrap">
    ${titleBlock(slide, true)}
    <div class="process">
      ${slide.steps.map((step) => `
        <article class="step">
          ${step[0] ? `<b>${safe(step[0])}</b>` : "<b></b>"}
          <h3>${lines(step[1])}</h3>
          ${step[2] ? `<p>${lines(step[2])}</p>` : ""}
        </article>`).join("")}
    </div>
    <div class="operations">
      ${slide.groups.map((group) => `
        <article>
          <h3>${lines(group[0])}</h3>
          <p>${lines(group[1])}</p>
        </article>`).join("")}
    </div>
  </div>`;
}

function media(src, alt = "") {
  if (!src) return "";
  return `<figure class="media"><img src="${safe(src)}" alt="${safe(alt)}"></figure>`;
}

function imageOnly(slide) {
  return `<div class="image-only">
    ${slide.title ? titleBlock(slide, true) : `<p class="eyebrow">${lines(slide.eyebrow || "")}</p>`}
    <img src="${safe(slide.image)}" alt="${safe(slide.title || slide.eyebrow || "La Wash")}">
  </div>`;
}

const backgroundPools = {
  Inicio: ["assets/source-media/image2.png", "assets/source-media/image11.jpeg"],
  Modelo: ["assets/source-media/image19.png", "assets/source-media/image18.png", "assets/source-media/image11.jpeg"],
  Nexa: ["assets/source-media/image30.png", "assets/source-media/image35.png", "assets/source-media/image22.png", "assets/source-media/image36.png", "assets/source-media/image40.png"],
  Servicios: ["assets/source-media/image42.png", "assets/source-media/image44.png", "assets/source-media/image47.png"],
  Prueba: ["assets/source-media/image53.png", "assets/source-media/image54.png", "assets/source-media/image55.png", "assets/source-media/image56.png", "assets/source-media/image57.png"],
  Cierre: ["assets/source-media/image58.png", "assets/source-media/image60.png"]
};

function backgroundFor(slide, index) {
  if (slide.background) return slide.background;
  if (slide.image) return slide.image;
  const pool = backgroundPools[slide.section] || backgroundPools.Inicio;
  return pool[index % pool.length];
}

function slideStyle(slide, index) {
  return ` style="--slide-bg: url('../${safe(backgroundFor(slide, index))}')"`;
}

function layout(slide) {
  if (slide.layout === "hero") {
    return `<div class="hero-layout ${slide.foreground === false ? "no-foreground" : ""}">
      <div>${titleBlock(slide)}${renderStats(slide.stats, true)}</div>
      ${slide.foreground === false ? "" : media(slide.image, "App La Wash")}
      ${renderAction(slide.action)}
    </div>`;
  }
  if (slide.layout === "statement") {
    return `<div class="statement-layout">
      <div>${titleBlock(slide)}${renderStats(slide.stats)}</div>
      ${media(slide.image, "Lavandería La Wash")}
    </div>`;
  }
  if (slide.layout === "process") return renderProcess(slide);
  if (slide.layout === "metrics") {
    return `<div class="metrics-layout">
      <div>${titleBlock(slide)}${renderStats(slide.stats)}</div>
      ${media(slide.image, "Lavandería La Wash")}
    </div>`;
  }
  if (slide.layout === "pillars") {
    return `<div class="pillars-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "Interior La Wash")}
    </div>`;
  }
  if (slide.layout === "nexa") {
    return `<div class="nexa-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Nexa")}
    </div>`;
  }
  if (slide.layout === "image-cards") {
    return `<div class="image-cards-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "three-col")}</div>
      ${media(slide.image, "Nexa POS")}
    </div>`;
  }
  if (slide.layout === "upsell") {
    return `<div class="upsell-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      <div>${media(slide.image, "Nexa POS upselling")}${renderStats(slide.stats, true)}</div>
    </div>`;
  }
  if (slide.layout === "dashboard") {
    return `<div class="dashboard-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "Nexa Gestión")}
    </div>`;
  }
  if (slide.layout === "commerce") {
    return `<div class="commerce-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Nexa Commerce")}
    </div>`;
  }
  if (slide.layout === "customer") {
    return `<div class="customer-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "App La Wash")}
    </div>`;
  }
  if (slide.layout === "app") {
    return `<div class="app-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Nexa App")}
    </div>`;
  }
  if (slide.layout === "services") {
    return `<div class="services-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "service-grid")}</div>
      ${media(slide.image, "Servicios La Wash")}
    </div>`;
  }
  if (slide.layout === "support") {
    return `<div class="support-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "Soporte La Wash")}
    </div>`;
  }
  if (slide.layout === "care") {
    return `<div class="care-layout">
      <div>${titleBlock(slide, true)}${renderStats(slide.stats)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Atención La Wash")}
    </div>`;
  }
  if (slide.layout === "press") {
    return `<div class="press-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      <div class="press-media">
        ${media(slide.image, "La Wash en prensa")}
        ${(slide.supportImages || []).map((src) => `<img src="${safe(src)}" alt="">`).join("")}
      </div>
    </div>`;
  }
  if (slide.layout === "image-only") return imageOnly(slide);
  if (slide.layout === "cta") {
    return `<div class="cta-layout">
      <div>${titleBlock(slide)}${slide.qr ? `<img class="qr" src="${safe(slide.qr)}" alt="QR">` : ""}</div>
      ${media(slide.image, "Siguiente paso")}
    </div>`;
  }
  if (slide.layout === "closing") {
    return `<div class="closing-layout">
      <img class="closing-main" src="${safe(slide.image)}" alt="La Wash">
      <div class="socials">${(slide.supportImages || []).map((src) => `<img src="${safe(src)}" alt="">`).join("")}</div>
    </div>`;
  }
  return `<div class="stack">${titleBlock(slide, true)}${renderCards(slide.cards || [])}</div>`;
}

function render() {
  deck.innerHTML = slides.map((slide, i) => `
    <section class="slide ${safe(slide.theme || "")}" id="slide-${i + 1}" data-index="${i}"${slideStyle(slide, i)}>
      <div class="slide-grid">
        ${header(slide, i)}
        <main>${layout(slide, i)}</main>
        ${footer(slide)}
      </div>
    </section>`).join("");
}

function getActiveSection(index) {
  return [...document.querySelectorAll("[data-jump]")]
    .map((button) => ({ button, jump: Number(button.dataset.jump) }))
    .filter((item) => item.jump <= index)
    .sort((a, b) => b.jump - a.jump)[0];
}

function update(next) {
  current = Math.max(0, Math.min(slides.length - 1, next));
  document.querySelectorAll(".slide").forEach((section, i) => {
    section.classList.toggle("active", i === current);
    section.classList.toggle("before", i < current);
  });
  counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  const active = getActiveSection(current);
  document.querySelectorAll("[data-jump]").forEach((button) => button.classList.toggle("is-active", button === active?.button));
  if (sectionName) sectionName.textContent = slides[current]?.section || active?.button?.textContent || "Core";
  history.replaceState(null, "", `#slide-${current + 1}`);
}

render();
update(current);

document.getElementById("next").addEventListener("click", () => update(current + 1));
document.getElementById("prev").addEventListener("click", () => update(current - 1));
document.getElementById("home").addEventListener("click", () => update(0));
document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => update(Number(button.dataset.jump)));
});
deck.addEventListener("click", (event) => {
  const button = event.target.closest("[data-footer-nav]");
  if (!button) return;
  if (button.dataset.footerNav === "home") update(0);
  if (button.dataset.footerNav === "prev") update(current - 1);
  if (button.dataset.footerNav === "next") update(current + 1);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") update(current + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") update(current - 1);
  if (event.key === "Home") update(0);
  if (event.key === "End") update(slides.length - 1);
});
window.addEventListener("hashchange", () => {
  const requested = Number(location.hash.replace("#slide-", "")) - 1;
  if (Number.isFinite(requested)) update(requested);
});
