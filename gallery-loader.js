/*
  REFIT Gallery Loader V5.5
  - Project Album Library jump buttons
  - Album title sections + album enquiry buttons
  - Lightbox Previous / Next browsing
*/

const REFIT_GALLERY_SOURCES = [
  { owner: "lyode", repo: "refit-media", branch: "main", path: "images", label: "REFIT Media" },
  { owner: "lyode", repo: "refitinterior", branch: "main", path: "assets", label: "Website Assets" }
];

const REFIT_FALLBACK_IMAGES = [
  "assets/project-commercial-1.jpg",
  "assets/project-commercial-2.jpg",
  "assets/project-commercial-3.jpg",
  "assets/project-residential-1.jpg",
  "assets/project-residential-2.jpg"
];

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const excludedWords = ["logo","favicon","icon","wordmark","android","apple","placeholder","400.400","800px","incometax"];

function buildNumberSet(ranges) {
  const set = new Set();
  ranges.forEach(([start, end]) => {
    for (let i = start; i <= end; i += 1) set.add(i);
  });
  return set;
}

const albumRules = [
  { id:"album-1", albumNo:1, rangeLabel:"01–19", name:"Artificial View / 3D Perspective", shortName:"3D Perspective", category:"concept", description:"Concept visuals and perspective references used to communicate design direction before work begins.", numbers:buildNumberSet([[1,19]]) },
  { id:"album-2", albumNo:2, rangeLabel:"20–28, 69–71", name:"Commercial F&B", shortName:"F&B", category:"fnb", description:"Food and beverage project references for customer-facing spaces, shopfronts and practical business operations.", numbers:buildNumberSet([[20,28],[69,71]]) },
  { id:"album-3", albumNo:3, rangeLabel:"29–31", name:"Commercial Retail", shortName:"Retail", category:"commercial", description:"Retail references focused on display, circulation, brand impression and practical commercial use.", numbers:buildNumberSet([[29,31]]) },
  { id:"album-4", albumNo:4, rangeLabel:"32–37, 72–74", name:"Residential / Condo", shortName:"Condo", category:"residential", description:"Residential and condominium references for practical living spaces, renovation planning and finishing direction.", numbers:buildNumberSet([[32,37],[72,74]]) },
  { id:"album-5", albumNo:5, rangeLabel:"38–40", name:"Commercial / Bakery Counter / Kiosk", shortName:"Kiosk", category:"commercial", description:"Compact commercial references such as counter, kiosk and small-space business improvement works.", numbers:buildNumberSet([[38,40]]) },
  { id:"album-6", albumNo:6, rangeLabel:"41–52", name:"Residential / Double Storey Terrace House", shortName:"Terrace House", category:"residential", description:"Landed residential references for double storey terrace houses, family spaces and renovation coordination.", numbers:buildNumberSet([[41,52]]) },
  { id:"album-7", albumNo:7, rangeLabel:"53–57", name:"Commercial / F&B Cafe Restaurant", shortName:"Cafe Restaurant", category:"fnb", description:"Cafe and restaurant references for ambience, layout, customer experience and operational flow.", numbers:buildNumberSet([[53,57]]) },
  { id:"album-8", albumNo:8, rangeLabel:"58–64", name:"Commercial / Offices", shortName:"Offices", category:"commercial", description:"Office and commercial workplace references for practical layout, presentation and daily business use.", numbers:buildNumberSet([[58,64]]) }
];

const extraAlbum = { id:"album-extra", albumNo:9, rangeLabel:"Extra", name:"Additional Project References", shortName:"Additional", category:"project", description:"Additional references collected from REFIT project media and supporting visual records." };
const hiddenReferenceNumbers = buildNumberSet([[65,68]]);

let currentLightboxImages = [];
let currentLightboxIndex = 0;

function injectGalleryStyle() {
  if (document.getElementById("refit-gallery-v54-style")) return;
  const style = document.createElement("style");
  style.id = "refit-gallery-v54-style";
  style.textContent = `
    .gallery-caption b{font-size:13px!important;line-height:1.25!important;font-weight:650!important;letter-spacing:-.01em!important}
    .gallery-caption span{font-size:9px!important;letter-spacing:.13em!important;margin-bottom:5px!important}
    .gallery-caption small{font-size:11px!important;line-height:1.35!important}

    .portfolio-album-nav{
      grid-column:1/-1;border:1px solid rgba(255,255,255,.13);border-radius:30px;padding:24px;margin:0 0 34px;
      background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.025));box-shadow:0 22px 70px rgba(0,0,0,.28)
    }
    .portfolio-album-nav-top{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:18px}
    .portfolio-album-nav-top span{color:#ffb2c1;font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
    .portfolio-album-nav-top p{margin:5px 0 0;color:#a8a2a0;font-size:14px}
    .portfolio-album-nav-grid{display:flex;flex-wrap:wrap;gap:10px}
    .album-jump-btn{
      display:inline-flex;align-items:center;gap:8px;min-height:42px;border:1px solid rgba(255,255,255,.16);border-radius:999px;
      padding:0 14px;background:rgba(255,255,255,.045);color:#f7f3ee;font-size:12px;font-weight:850;text-decoration:none;
      transition:transform .2s ease, background .2s ease, border-color .2s ease
    }
    .album-jump-btn:hover{transform:translateY(-2px);background:rgba(229,129,150,.16);border-color:rgba(255,178,193,.45)}
    .album-jump-btn small{color:#ffb2c1;font-size:10px;letter-spacing:.08em;text-transform:uppercase}

    .album-section{grid-column:1/-1;border-top:1px solid rgba(255,255,255,.13);padding-top:44px;margin-top:38px;scroll-margin-top:120px}
    .album-section:first-of-type{border-top:0;padding-top:0;margin-top:0}
    .album-heading{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:end;margin-bottom:22px}
    .album-kicker{display:inline-flex;align-items:center;gap:10px;color:#ffb2c1;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase;margin-bottom:12px}
    .album-kicker:before{content:"";width:34px;height:1px;background:#e58196}
    .album-heading h2{font-size:clamp(28px,3.8vw,52px);line-height:.98;margin:0;letter-spacing:-.055em}
    .album-heading p{margin:10px 0 0;color:#a8a2a0;font-size:15px;max-width:760px}
    .album-heading-meta{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
    .album-tag{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 12px;color:#ffb2c1;font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;background:rgba(229,129,150,.08)}
    .album-mini-cta{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:10px 14px;background:rgba(255,255,255,.05);color:#fff;font-size:12px;font-weight:850;text-decoration:none;box-shadow:0 14px 34px rgba(0,0,0,.22)}
    .album-mini-cta:hover{transform:translateY(-2px);background:#fff;color:#08080a}

    .album-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
    .album-grid .gallery-card{grid-column:span 4;min-height:280px}
    .album-grid .gallery-card.large{grid-column:span 6;min-height:360px}
    .gallery-scroller .gallery-card{min-height:390px!important}

    .album-cta{margin-top:18px;border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:20px;background:linear-gradient(135deg,rgba(229,129,150,.12),rgba(255,255,255,.035));display:flex;justify-content:space-between;align-items:center;gap:18px}
    .album-cta strong{display:block;color:#fff;font-size:17px;margin-bottom:4px}
    .album-cta span{display:block;color:#a8a2a0;font-size:13px}
    .album-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:999px;background:#25D366;color:#fff;font-size:13px;font-weight:900;text-decoration:none;white-space:nowrap;box-shadow:0 16px 38px rgba(37,211,102,.28)}

    .lightbox-nav-btn{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      z-index:20;
      width:54px;
      height:54px;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.22);
      background:rgba(0,0,0,.55);
      color:#fff;
      font-size:26px;
      line-height:1;
      display:grid;
      place-items:center;
      cursor:pointer;
      backdrop-filter:blur(10px);
      box-shadow:0 18px 42px rgba(0,0,0,.32);
    }
    .lightbox-nav-btn:hover{background:rgba(229,129,150,.82)}
    .lightbox-nav-prev{left:18px}
    .lightbox-nav-next{right:18px}
    .lightbox-counter{
      display:inline-flex;
      align-items:center;
      margin-left:12px;
      color:#a8a2a0;
      font-size:12px;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    @media(max-width:900px){
      .portfolio-album-nav-top{align-items:flex-start;flex-direction:column}
      .album-heading{grid-template-columns:1fr}
      .album-heading-meta{align-items:flex-start}
      .album-grid{grid-template-columns:repeat(6,1fr)}
      .album-grid .gallery-card,.album-grid .gallery-card.large{grid-column:span 6;min-height:320px}
      .album-cta{align-items:flex-start;flex-direction:column}
    }
    @media(max-width:560px){
      .portfolio-album-nav{padding:18px;border-radius:24px}
      .album-jump-btn{font-size:11px;min-height:38px;padding:0 11px}
      .album-heading h2{font-size:32px}
      .album-heading p{font-size:14px}
      .album-grid .gallery-card,.album-grid .gallery-card.large{min-height:290px}
      .album-cta a{width:100%}
      .lightbox-nav-btn{width:44px;height:44px;font-size:21px}
      .lightbox-nav-prev{left:10px}
      .lightbox-nav-next{right:10px}
      .lightbox-counter{display:block;margin-left:0;margin-top:5px}
    }`;
  document.head.append(style);
}

function cleanDuplicatedPortfolioHeading() {
  const isPortfolio = location.pathname.toLowerCase().includes("portfolio") || document.title.toLowerCase().includes("project references");
  if (!isPortfolio) return;
  const heroEyebrow = document.querySelector(".hero .eyebrow");
  const heroTitle = document.querySelector(".hero h1");
  if (heroEyebrow && heroEyebrow.textContent.trim().toLowerCase().includes("project")) heroEyebrow.textContent = "Full Gallery";
  if (heroTitle) heroTitle.textContent = "Project References";
  if (document.title.toLowerCase().includes("project gallery")) document.title = "Project References | REFIT Interior";
}

function naturalCompare(a,b) {
  return String(a.path || a.name || "").localeCompare(String(b.path || b.name || ""), undefined, {numeric:true, sensitivity:"base"});
}
function isImageFile(name) {
  const lower = String(name || "").toLowerCase();
  return imageExtensions.some(ext => lower.endsWith(ext)) && !excludedWords.some(word => lower.includes(word));
}
function albumForReference(referenceNo) {
  return albumRules.find(rule => rule.numbers.has(referenceNo)) || null;
}
function categoryLabel(category) {
  return { commercial:"Commercial", fnb:"Food & Beverage", residential:"Residential", maintenance:"Maintenance", concept:"Concept", project:"Project" }[category] || "Project";
}
function pad2(value) {
  return String(value).padStart(2, "0");
}
function albumWhatsappLink(album) {
  const text = `Hello REFIT, I am viewing Album ${pad2(album.albumNo)} - ${album.name} on your portfolio. I have a similar project and would like REFIT to advise the next step.`;
  return "https://wa.me/60122145922?text=" + encodeURIComponent(text);
}

async function fetchGithubDirectory(source, path = source.path, depth = 0) {
  if (depth > 3) return [];
  const cleanPath = encodeURIComponent(path).replace(/%2F/g, "/");
  const apiUrl = `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${cleanPath}?ref=${source.branch}`;
  const response = await fetch(apiUrl, { headers: { "Accept": "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`Could not read ${source.repo}/${path}`);
  const entries = await response.json();
  if (!Array.isArray(entries)) return [];
  const imageFiles = [];
  const folders = [];
  entries.forEach(entry => {
    if (entry.type === "file" && isImageFile(entry.name)) imageFiles.push(entry);
    if (entry.type === "dir") folders.push(entry.path);
  });
  imageFiles.sort(naturalCompare);
  folders.sort((a,b) => a.localeCompare(b, undefined, {numeric:true, sensitivity:"base"}));
  const nestedFiles = [];
  for (const folderPath of folders) {
    try {
      const nested = await fetchGithubDirectory(source, folderPath, depth + 1);
      nestedFiles.push(...nested);
    } catch (error) {
      console.warn("Skipped folder:", folderPath, error);
    }
  }
  return [...imageFiles, ...nestedFiles];
}

async function fetchImagesFromSource(source) {
  const files = await fetchGithubDirectory(source);
  return files.sort(naturalCompare).map(file => ({ src:file.download_url, rawName:file.name, path:file.path, source:source.label }));
}

async function fetchAssetImages() {
  const collected = [];
  for (const source of REFIT_GALLERY_SOURCES) {
    try {
      const images = await fetchImagesFromSource(source);
      collected.push(...images);
    } catch (error) {
      console.warn("Gallery source unavailable:", source.repo, error);
    }
  }
  const unique = [];
  const seen = new Set();
  collected.forEach(item => {
    if (!item.src || seen.has(item.src)) return;
    seen.add(item.src);
    unique.push(item);
  });
  if (unique.length) {
    return unique.map((item, sourceIndex) => {
      const referenceNo = sourceIndex + 1;
      if (hiddenReferenceNumbers.has(referenceNo)) return null;
      const album = albumForReference(referenceNo) || extraAlbum;
      return { ...item, referenceNo, albumId:album.id, albumNo:album.albumNo, albumName:album.name, rangeLabel:album.rangeLabel, category:album.category, title:album.name, caption:`Photo ${pad2(referenceNo)}` };
    }).filter(Boolean);
  }
  return REFIT_FALLBACK_IMAGES.map((src, index) => {
    const referenceNo = index + 1;
    const album = albumForReference(referenceNo) || albumRules[0];
    return { src, rawName:src.split("/").pop(), referenceNo, albumId:album.id, albumNo:album.albumNo, albumName:album.name, rangeLabel:album.rangeLabel, category:album.category, title:album.name, caption:`Photo ${pad2(referenceNo)}`, source:"Fallback" };
  });
}

function createGalleryCard(item, index, largeEvery = true) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  if (largeEvery && (index === 0 || index % 7 === 0)) card.classList.add("large");
  card.dataset.category = item.category;
  card.dataset.album = item.albumId;
  const img = document.createElement("img");
  img.src = item.src;
  img.alt = `${item.albumName} - ${item.caption}`;
  img.loading = "lazy";
  const caption = document.createElement("div");
  caption.className = "gallery-caption";
  caption.innerHTML = `<span>Album ${pad2(item.albumNo)} / ${item.caption}</span><b>${item.albumName}</b><small>${categoryLabel(item.category)}</small>`;
  card.append(img, caption);
  card.addEventListener("click", () => openLightbox(item));
  return card;
}

function renderScroller(target, images) {
  target.innerHTML = "";
  images.forEach((item, index) => target.append(createGalleryCard(item, index, false)));
}

function renderAlbumJumpNav(target, images, orderedAlbums) {
  const nav = document.createElement("div");
  nav.className = "portfolio-album-nav";
  nav.innerHTML = `<div class="portfolio-album-nav-top"><div><span>Project Album Library</span><p>Jump directly to the type of space you want to view.</p></div></div>`;
  const grid = document.createElement("div");
  grid.className = "portfolio-album-nav-grid";
  orderedAlbums.forEach(album => {
    const albumImages = images.filter(item => item.albumId === album.id);
    if (!albumImages.length) return;
    const link = document.createElement("a");
    link.className = "album-jump-btn";
    link.href = `#portfolio-${album.id}`;
    link.dataset.albumCategory = album.category;
    link.innerHTML = `<small>${pad2(album.albumNo)}</small>${album.shortName || album.name}`;
    grid.append(link);
  });
  nav.append(grid);
  target.append(nav);
}

function renderAlbumSections(target, images) {
  target.innerHTML = "";
  const orderedAlbums = [...albumRules, extraAlbum];
  renderAlbumJumpNav(target, images, orderedAlbums);
  orderedAlbums.forEach(album => {
    const albumImages = images.filter(item => item.albumId === album.id);
    if (!albumImages.length) return;
    const section = document.createElement("section");
    section.id = `portfolio-${album.id}`;
    section.className = "album-section";
    section.dataset.category = album.category;
    section.dataset.album = album.id;
    const heading = document.createElement("div");
    heading.className = "album-heading";
    heading.innerHTML = `<div class="album-heading-copy"><span class="album-kicker">Album ${pad2(album.albumNo)}</span><h2>${album.name}</h2><p>${album.description}</p></div><div class="album-heading-meta"><span class="album-tag">Ref. ${album.rangeLabel}</span><a class="album-mini-cta" href="${albumWhatsappLink(album)}" target="_blank" rel="noopener">Ask REFIT</a></div>`;
    const grid = document.createElement("div");
    grid.className = "album-grid";
    albumImages.forEach((item, index) => grid.append(createGalleryCard(item, index, true)));
    const cta = document.createElement("div");
    cta.className = "album-cta";
    cta.innerHTML = `<div><strong>Have a similar project?</strong><span>Send this album direction to REFIT and tell us what kind of space you are planning.</span></div><a href="${albumWhatsappLink(album)}" target="_blank" rel="noopener">WhatsApp REFIT</a>`;
    section.append(heading, grid, cta);
    target.append(section);
  });
}

function updateAlbumJumpNav(filter) {
  document.querySelectorAll(".album-jump-btn").forEach(link => {
    const category = link.dataset.albumCategory;
    link.style.display = filter === "all" || category === filter ? "" : "none";
  });
}

function applyFilter(target, filter) {
  if (target.querySelector(".album-section")) {
    target.querySelectorAll(".album-section").forEach(section => {
      const visibleCards = [];
      section.querySelectorAll(".gallery-card").forEach(card => {
        const isVisible = filter === "all" || card.dataset.category === filter;
        card.style.display = isVisible ? "" : "none";
        if (isVisible) visibleCards.push(card);
      });
      section.style.display = visibleCards.length ? "" : "none";
    });
    updateAlbumJumpNav(filter);
    return;
  }
  target.querySelectorAll(".gallery-card").forEach(card => {
    card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
  });
}

function ensureLightboxControls() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const content = lightbox.querySelector(".lightbox-content") || lightbox;

  if (!lightbox.querySelector(".lightbox-nav-prev")) {
    const prev = document.createElement("button");
    prev.className = "lightbox-nav-btn lightbox-nav-prev";
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous photo");
    prev.textContent = "‹";
    prev.addEventListener("click", event => {
      event.stopPropagation();
      moveLightbox(-1);
    });
    content.append(prev);
  }

  if (!lightbox.querySelector(".lightbox-nav-next")) {
    const next = document.createElement("button");
    next.className = "lightbox-nav-btn lightbox-nav-next";
    next.type = "button";
    next.setAttribute("aria-label", "Next photo");
    next.textContent = "›";
    next.addEventListener("click", event => {
      event.stopPropagation();
      moveLightbox(1);
    });
    content.append(next);
  }

  const caption = lightbox.querySelector("[data-lightbox-caption]");
  if (caption && !lightbox.querySelector(".lightbox-counter")) {
    const counter = document.createElement("span");
    counter.className = "lightbox-counter";
    counter.setAttribute("data-lightbox-counter", "");
    caption.after(counter);
  }
}

function showLightboxImage(index) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox || !currentLightboxImages.length) return;

  currentLightboxIndex = (index + currentLightboxImages.length) % currentLightboxImages.length;
  const item = currentLightboxImages[currentLightboxIndex];

  const img = lightbox.querySelector("img");
  img.src = item.src;
  img.alt = `${item.albumName} - ${item.caption}`;

  lightbox.querySelector("[data-lightbox-title]").textContent = item.albumName;
  lightbox.querySelector("[data-lightbox-caption]").textContent = `Album ${pad2(item.albumNo)} · ${item.caption}`;

  const counter = lightbox.querySelector("[data-lightbox-counter]");
  if (counter) {
    counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
  }
}

function moveLightbox(direction) {
  showLightboxImage(currentLightboxIndex + direction);
}

function openLightbox(item) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  ensureLightboxControls();

  const foundIndex = currentLightboxImages.findIndex(image =>
    image.src === item.src && image.referenceNo === item.referenceNo
  );

  showLightboxImage(foundIndex >= 0 ? foundIndex : 0);
  lightbox.classList.add("show");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("show");
  document.body.classList.remove("lightbox-open");
}

async function initGallery({ targetId = "projectGallery", limit = null, scroller = false } = {}) {
  injectGalleryStyle();
  cleanDuplicatedPortfolioHeading();
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = "";
  const loading = document.createElement("p");
  loading.textContent = "Loading project references...";
  loading.style.color = "#a8a2a0";
  target.append(loading);
  try {
    const allImages = await fetchAssetImages();
    const images = limit ? allImages.slice(0, limit) : allImages;
    currentLightboxImages = images;
    if (scroller) renderScroller(target, images);
    else renderAlbumSections(target, images);
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        applyFilter(target, filter);
      });
    });
  } catch (error) {
    target.innerHTML = "<p style='color:#a8a2a0'>Project references could not load yet. Please refresh again shortly.</p>";
    console.error(error);
  }
}

window.initGallery = initGallery;

document.addEventListener("DOMContentLoaded", () => {
  injectGalleryStyle();
  cleanDuplicatedPortfolioHeading();
  document.querySelectorAll("[data-lightbox-close]").forEach(btn => btn.addEventListener("click", closeLightbox));
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", event => {
    const lightbox = document.getElementById("lightbox");
    const isOpen = lightbox && lightbox.classList.contains("show");
    if (event.key === "Escape") closeLightbox();
    if (!isOpen) return;
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });
});
