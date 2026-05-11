// La Wash GO deck renderer
// Fork of root scripts/deck.js adapted for go/ subdirectory:
//   · asset paths in slides.js already include ../ so no extra ../ is prepended here
//   · header logo uses ../assets/source-media/image4.png
//   · backgroundPools use ../assets/source-media/...
//   · default footer text updated for GO product
//   · adds go-winwin and go-amortize layout renderers

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
      <div class="mark"><img src="../assets/source-media/image4.png" alt="La Wash"></div>
      <div class="head-meta">${safe(slide.section || "GO")}</div>
      <div class="head-count">${String(i + 1).padStart(2, "0")} / ${slides.length}</div>
    </div>`;
}

function footer(slide) {
  const footText = slide.foot === false ? "" : (slide.foot ? lines(slide.foot) : "La Wash GO · Módulo compacto de lavandería autoservicio");
  const footContent = slide.footLink
    ? `<a class="hero-action" href="${safe(slide.footLink[1])}" target="_blank" rel="noopener">${lines(slide.footLink[0])}</a>`
    : footText;
  return `<div class="slide-foot">
    <div>${footContent}</div>
  </div>`;
}

function renderStats(stats = [], compact = false) {
  return `<div class="stats ${compact ? "compact" : ""} count-${stats.length}">${stats.map((stat) => `
    <article class="stat">
      ${stat[2] ? `<img class="stat-icon" src="${safe(stat[2])}" alt="">` : ""}
      <strong>${lines(stat[0])}</strong>
      ${stat[1] ? `<span>${lines(stat[1])}</span>` : ""}
    </article>`).join("")}</div>`;
}

function renderBigStats(stats = []) {
  return `<div class="big-stats">${stats.map((stat) => `
    <div class="big-stat">
      <strong>${lines(stat[0])}</strong>
      ${stat[1] ? `<span>${lines(stat[1])}</span>` : ""}
    </div>`).join("")}</div>`;
}

function renderAction(action) {
  if (!action) return "";
  return `<a class="hero-action" href="${safe(action[1])}" target="_blank" rel="noopener">${lines(action[0])}</a>`;
}

function renderCards(cards = [], className = "") {
  return `<div class="cards ${className}">${cards.map((card) => `
    <article class="card">
      ${card[2] ? `<span class="card-icon">${card[2]}</span>` : ""}
      <h3>${lines(card[0])}</h3>
      ${card[1] ? `<p>${lines(card[1])}</p>` : ""}
    </article>`).join("")}</div>`;
}

function media(src, alt = "") {
  if (!src) return "";
  return `<figure class="media"><img src="${safe(src)}" alt="${safe(alt)}"></figure>`;
}

// ── Go Win-Win layout renderer ──────────────────────────────────────────────
function renderGoWinwin(slide) {
  const ww = slide.winwin || {};
  const investor = ww.investor || {};
  const lawash = ww.lawash || {};
  const investorHTML = `
    <div class="gww-col gww-col--investor">
      <h3 class="gww-col-title">${safe(investor.label || "")}</h3>
      <ul class="gww-list">${(investor.items || []).map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
    </div>`;
  const lawashHTML = `
    <div class="gww-col gww-col--lawash">
      <h3 class="gww-col-title">${safe(lawash.label || "")}</h3>
      <ul class="gww-list">${(lawash.items || []).map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
    </div>`;
  return `<div class="go-winwin">
    <div class="gww-header">${titleBlock(slide, true)}</div>
    <div class="gww-cols">
      ${investorHTML}
      <div class="gww-arrow">⇄</div>
      ${lawashHTML}
    </div>
    ${slide.stats ? `<div class="gww-stats">${renderStats(slide.stats)}</div>` : ""}
  </div>`;
}

// ── Go Amortize layout renderer ──────────────────────────────────────────────
function renderGoAmortize(slide) {
  const am = slide.amortize || {};
  const scenarios = am.scenarios || [];
  const steps = am.steps || [];
  const headHTML = `
    <div class="gam-row gam-head">
      <span>Inversión La Wash</span>
      <span>Espacio / mes</span>
      <span>Años amortización</span>
      <span>Reparto durante período</span>
    </div>`;
  const rowsHTML = scenarios.map((s) => `
    <div class="gam-row">
      <span>${safe(s.inversion)}</span>
      <span>${safe(s.espacio)}</span>
      <span>${safe(s.anos)}</span>
      <span>${safe(s.reparto)}</span>
    </div>`).join("");
  const stepsHTML = steps.map((s) => `
    <div class="gam-step">
      <div class="gam-step-label">${safe(s.label)}</div>
      <div class="gam-step-title">${safe(s.title)}</div>
      <div class="gam-step-text">${safe(s.text)}</div>
    </div>`).join("");
  return `<div class="go-amortize">
    <div class="gam-header">${titleBlock(slide, true)}</div>
    <div class="gam-table">
      ${headHTML}
      ${rowsHTML}
      ${am.highlight ? `<div class="gam-highlight">${safe(am.highlight)}</div>` : ""}
    </div>
    <div class="gam-steps">${stepsHTML}</div>
  </div>`;
}

// ── Background pools (paths already include ../ since they are used directly in url()) ──
const backgroundPools = {
  Inicio:    ["../assets/source-media/image2.png", "../assets/source-media/image11.jpeg"],
  GO:        ["../assets/source-media/image18.png", "../assets/source-media/image42.png", "../assets/source-media/image47.png"],
  Nexa:      ["../assets/source-media/image30.png", "../assets/source-media/image35.png", "../assets/source-media/image22.png", "../assets/source-media/image36.png"],
  "Inversión": ["../assets/source-media/image19.png", "../assets/source-media/image18.png"],
  Cierre:    ["../assets/source-media/image58.png", "../assets/source-media/image60.png"]
};

function backgroundFor(slide, index) {
  if (slide.background) return slide.background;
  if (slide.image) return slide.image;
  const pool = backgroundPools[slide.section] || backgroundPools.Inicio;
  return pool[index % pool.length];
}

// No extra ../ prefix – paths in slides.js and backgroundPools already contain ../
function slideStyle(slide, index) {
  if (slide.noBackground) return ' style="--slide-bg: none"';
  return ` style="--slide-bg: url('${safe(backgroundFor(slide, index))}')"`;
}

function imageOnly(slide) {
  return `<div class="image-only">
    ${slide.title ? titleBlock(slide, true) : `<p class="eyebrow">${lines(slide.eyebrow || "")}</p>`}
    <img src="${safe(slide.image)}" alt="${safe(slide.title || slide.eyebrow || "La Wash")}">
  </div>`;
}

function renderProcess(slide) {
  const steps = slide.steps || [];
  const groups = slide.groups || [];
  const pos = [
    { x: 5,  y: 62 }, { x: 22, y: 76 }, { x: 39, y: 24 },
    { x: 56, y: 62 }, { x: 73, y: 55 }, { x: 90, y: 10 }
  ];
  const path = "M5,62 C13,62 14,76 22,76 S30,24 39,24 S47,62 56,62 S67,55 73,55 S84,10 90,10";
  const nodesHTML = steps.map((step, i) => {
    const p = pos[i] || { x: 50, y: 50 };
    const hasNum = !!step[0];
    return `<div class="snode" style="left:${p.x}%;top:${p.y}%">
      <div class="snode__above"><strong>${lines(step[1])}</strong></div>
      <div class="snode__dot${hasNum ? "" : " snode__dot--end"}">${hasNum ? safe(step[0]) : "✦"}</div>
      ${step[2] ? `<div class="snode__below"><p>${safe(step[2])}</p></div>` : ""}
    </div>`;
  }).join("");
  const quadsHTML = groups.map((g) => `<div class="wquad">
    <h4>${lines(g[0])}</h4>
    ${g[1] ? `<p>${lines(g[1])}</p>` : ""}
  </div>`).join("");
  return `<div class="process-v2">
    <div class="pv2-head">${titleBlock(slide)}</div>
    <div class="pv2-body">
      <div class="psnake">
        <svg class="psnake__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="${path}" fill="none" stroke="rgba(19,161,220,.55)" stroke-width="1.8" stroke-dasharray="3.5 2.5" stroke-linecap="round"/>
        </svg>
        ${nodesHTML}
      </div>
      <div class="pwheel">
        <div class="pwheel__grid">
          ${quadsHTML}
          <div class="pwheel__hub">+ Valor<br>para el<br>franquiciado</div>
        </div>
      </div>
    </div>
  </div>`;
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
    if (slide.foreground === false) {
      return `<div class="metrics-layout metrics-layout--nofg">
        <div>${titleBlock(slide)}${renderStats(slide.stats)}</div>
      </div>`;
    }
    return `<div class="metrics-layout">
      <div>${titleBlock(slide)}${renderStats(slide.stats)}</div>
      ${media(slide.image, "Lavandería La Wash")}
    </div>`;
  }
  if (slide.layout === "pillars") {
    return `<div class="pillars-v2">${(slide.cards || []).map((card, i) => `
      <div class="pv2-item pv2-item--${i}">
        <h2 class="pv2-title"><em class="pv2-initial">${safe(card[0][0])}</em>${lines(card[0].slice(1))}</h2>
        ${card[1] ? `<p class="pv2-desc">${lines(card[1])}</p>` : ""}
      </div>`).join("")}
    </div>`;
  }
  if (slide.layout === "nexa") {
    const cardsHTML = (slide.cards || []).map((c) => `
      <article class="nv2-card">
        <h3>${lines(c[0])}</h3>
        ${c[1] ? `<p>${lines(c[1])}</p>` : ""}
      </article>`).join("");
    return `<div class="nexa-v2">
      ${titleBlock(slide, true)}
      <div class="nv2-diagram">
        <img src="${safe(slide.image)}" alt="NEXA ecosystem diagram">
      </div>
      <div class="nv2-cards">${cardsHTML}</div>
    </div>`;
  }
  if (slide.layout === "image-cards") {
    if (slide.foreground === false) {
      return `<div class="image-cards-layout image-cards-layout--nofg">
        <div class="icl-gap"></div>
        <div>${titleBlock(slide, true)}${renderCards(slide.cards, "three-col")}</div>
      </div>`;
    }
    return `<div class="image-cards-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "three-col")}</div>
      ${media(slide.image, "Nexa POS")}
    </div>`;
  }
  if (slide.layout === "upsell") {
    if (slide.foreground === false) {
      return `<div class="upsell-layout upsell-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
        <div class="usl-stats">${renderBigStats(slide.stats)}</div>
        ${slide.action ? `<a class="hero-action hero-action--right" href="${safe(slide.action[1])}" target="_blank" rel="noopener">${lines(slide.action[0])}</a>` : ""}
      </div>`;
    }
    return `<div class="upsell-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      <div>${media(slide.image, "Nexa POS upselling")}${renderStats(slide.stats, true)}</div>
    </div>`;
  }
  if (slide.layout === "dashboard") {
    if (slide.foreground === false) {
      return `<div class="dashboard-layout dashboard-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      </div>`;
    }
    return `<div class="dashboard-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "Nexa Gestión")}
    </div>`;
  }
  if (slide.layout === "commerce") {
    if (slide.foreground === false) {
      return `<div class="commerce-layout commerce-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards, "three-col")}</div>
      </div>`;
    }
    return `<div class="commerce-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Nexa Commerce")}
    </div>`;
  }
  if (slide.layout === "customer") {
    if (slide.foreground === false) {
      return `<div class="customer-layout customer-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
        ${slide.action ? `<a class="hero-action hero-action--right" href="${safe(slide.action[1])}" target="_blank" rel="noopener">${lines(slide.action[0])}</a>` : ""}
      </div>`;
    }
    return `<div class="customer-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "App La Wash")}
    </div>`;
  }
  if (slide.layout === "app") {
    if (slide.foreground === false) {
      return `<div class="app-layout app-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      </div>`;
    }
    return `<div class="app-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "two-col")}</div>
      ${media(slide.image, "Nexa App")}
    </div>`;
  }
  if (slide.layout === "services") {
    if (slide.foreground === false) {
      return `<div class="services-layout services-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards, "service-grid")}</div>
      </div>`;
    }
    return `<div class="services-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards, "service-grid")}</div>
      ${media(slide.image, "Servicios La Wash")}
    </div>`;
  }
  if (slide.layout === "support") {
    if (slide.foreground === false) {
      return `<div class="support-layout support-layout--nofg">
        <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      </div>`;
    }
    return `<div class="support-layout">
      <div>${titleBlock(slide, true)}${renderCards(slide.cards)}</div>
      ${media(slide.image, "Soporte La Wash")}
    </div>`;
  }
  if (slide.layout === "care-v2") {
    const st = slide.bigStat || [];
    const cardsHTML = (slide.cards || []).map((card) => `
      <div class="cv2-card">
        <div class="cv2-title">
          <h3>${lines(card[0])}</h3>
          ${(card[2] || []).map((b) => `<span class="cv2-badge">${safe(b)}</span>`).join("")}
        </div>
        <ul class="cv2-list">${(card[1] || "").split("\n").filter(Boolean).map((item) => `<li>${lines(item)}</li>`).join("")}</ul>
      </div>`).join("");
    return `<div class="cv2-layout">
      <div class="cv2-header">${titleBlock(slide, true)}</div>
      <div class="cv2-left">
        <strong>${lines(st[0])}</strong>
        <span>${lines(st[1])}</span>
      </div>
      <div class="cv2-right">${cardsHTML}</div>
    </div>`;
  }
  if (slide.layout === "press-v2") {
    const cards = slide.pressCards || [];
    return `<div class="pv2-layout">
      ${titleBlock(slide, true)}
      <div class="pv2-2cols">
        ${cards.map((card) => `
          <div class="pv2-card">
            ${(card.images || (card.image ? [card.image] : [])).map((src) => `<img class="pv2-card-img" src="${safe(src)}" alt="">`).join("")}
            <div class="pv2-card-body">
              ${card.bullets
                ? `<ul class="pv2-bullets">${card.bullets.map((b) => `<li>${safe(b)}</li>`).join("")}</ul>`
                : `<p class="pv2-card-text">${safe(card.text || "")}</p>`
              }
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }
  if (slide.layout === "image-only") return imageOnly(slide);
  if (slide.layout === "bgonly") {
    return `<img class="bgonly-img" src="${safe(slide.image)}" alt="">`;
  }
  if (slide.layout === "cta") {
    const addressLines = slide.ctaAddress ? slide.ctaAddress.split("\n").map((l) => l.trim() === "" ? `<br>` : `<span>${safe(l)}</span>`).join("") : "";
    return `<div class="cta-layout">
      <div class="cta-top">
        ${titleBlock(slide)}
        ${slide.action ? `<a class="cta-link" href="${safe(slide.action[1])}" target="_blank" rel="noopener">${safe(slide.action[0])}</a>` : ""}
      </div>
      ${slide.ctaLogo ? `<img class="cta-logo-watermark" src="${safe(slide.ctaLogo)}" alt="La Wash">` : ""}
      ${slide.ctaAddress ? `<div class="cta-address">${addressLines}</div>` : ""}
    </div>`;
  }
  if (slide.layout === "closing") {
    const socialsHTML = (slide.socials || []).map(([src, href]) =>
      `<a href="${safe(href)}" target="_blank" rel="noopener"><img src="${safe(src)}" alt=""></a>`
    ).join("");
    const addrHTML = (slide.closingAddress || "").split("\n").map((l) => l.trim() === "" ? `<br>` : `<span>${safe(l)}</span>`).join("");
    return `<div class="closing-layout">
      ${slide.closingLogo ? `<img class="closing-logo" src="${safe(slide.closingLogo)}" alt="La Wash">` : ""}
      ${slide.closingAddress ? `<div class="closing-address">${addrHTML}</div>` : ""}
      <div class="socials">${socialsHTML}</div>
    </div>`;
  }
  // ── GO-specific layouts ──────────────────────────────────────────────────
  if (slide.layout === "go-winwin") return renderGoWinwin(slide);
  if (slide.layout === "go-amortize") return renderGoAmortize(slide);

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
  if (sectionName) sectionName.textContent = slides[current]?.section || active?.button?.textContent || "GO";
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
