/*
  REFIT Gallery Loader V5.3
  - Reads project photos from lyode/refit-media/images
  - Groups Project References by the requested album ranges
  - Removes Project Reference 65 to 68
  - Uses smaller photo caption text
  - Removes duplicated "Project References" wording on portfolio page
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
  { id:"album-1", albumNo:1, rangeLabel:"01–19", name:"Artificial View / 3D Perspective", category:"concept", numbers:buildNumberSet([[1,19]]) },
  { id:"album-2", albumNo:2, rangeLabel:"20–28, 69–71", name:"Commercial F&B", category:"fnb", numbers:buildNumberSet([[20,28],[69,71]]) },
  { id:"album-3", albumNo:3, rangeLabel:"29–31", name:"Commercial Retail", category:"commercial", numbers:buildNumberSet([[29,31]]) },
  { id:"album-4", albumNo:4, rangeLabel:"32–37, 72–74", name:"Residential / Condo", category:"residential", numbers:buildNumberSet([[32,37],[72,74]]) },
  { id:"album-5", albumNo:5, rangeLabel:"38–40", name:"Commercial / Bakery Counter / Kiosk", category:"commercial", numbers:buildNumberSet([[38,40]]) },
  { id:"album-6", albumNo:6, rangeLabel:"41–52", name:"Residential / Double Storey Terrace House", category:"residential", numbers:buildNumberSet([[41,52]]) },
  { id:"album-7", albumNo:7, rangeLabel:"53–57", name:"Commercial / F&B Cafe Restaurant", category:"fnb", numbers:buildNumberSet([[53,57]]) },
  { id:"album-8", albumNo:8, rangeLabel:"58–64", name:"Commercial / Offices", category:"commercial", numbers:buildNumberSet([[58,64]]) }
];

const hiddenReferenceNumbers = buildNumberSet([[65,68]]);

function injectGalleryStyle() {
  if (document.getElementById("refit-gallery-v53-style")) return;
  const style = document.createElement("style");
  style.id = "refit-gallery-v53-style";
  style.textContent = `
    .gallery-caption b{font-size:13px!important;line-height:1.25!important;font-weight:650!important;letter-spacing:-.01em!important}
    .gallery-caption span{font-size:9px!important;letter-spacing:.13em!important;margin-bottom:5px!important}
    .gallery-caption small{font-size:11px!important;line-height:1.35!important}
    .album-section{grid-column:1/-1;border-top:1px solid rgba(255,255,255,.13);padding-top:34px;margin-top:24px}
    .album-section:first-child{border-top:0;padding-top:0;margin-top:0}
    .album-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:18px}
    .album-heading h2{font-size:clamp(24px,3vw,38px);line-height:1.05;margin:0;letter-spacing:-.035em}
    .album-heading p{margin:6px 0 0;color:#a8a2a0;font-size:14px}
    .album-tag{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:8px 12px;color:#ffb2c1;font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;background:rgba(229,129,150,.08)}
    .album-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
    .album-grid .gallery-card{grid-column:span 4;min-height:280px}
    .album-grid .gallery-card.large{grid-column:span 6;min-height:360px}
    .gallery-scroller .gallery-card{min-height:390px!important}
    @media(max-width:760px){
      .album-heading{align-items:flex-start;flex-direction:column}
      .album-grid{grid-template-columns:1fr}
      .album-grid .gallery-card,.album-grid .gallery-card.large{grid-column:auto;min-height:320px}
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
      const album = albumForReference(referenceNo) || { id:"album-extra", albumNo:9, rangeLabel:"Extra", name:"Additional Project References", category:"project" };
      return {
        ...item,
        referenceNo,
        albumId:album.id,
        albumNo:album.albumNo,
        albumName:album.name,
        rangeLabel:album.rangeLabel,
        category:album.category,
        title:album.name,
        caption:`Photo ${String(referenceNo).padStart(2,"0")}`
      };
    }).filter(Boolean);
  }
  return REFIT_FALLBACK_IMAGES.map((src, index) => {
    const referenceNo = index + 1;
    const album = albumForReference(referenceNo) || albumRules[0];
    return { src, rawName:src.split("/").pop(), referenceNo, albumId:album.id, albumNo:album.albumNo, albumName:album.name, rangeLabel:album.rangeLabel, category:album.category, title:album.name, caption:`Photo ${String(referenceNo).padStart(2,"0")}`, source:"Fallback" };
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
  caption.innerHTML = `<span>Album ${item.albumNo}</span><b>${item.albumName}</b><small>${item.caption}</small>`;
  card.append(img, caption);
  card.addEventListener("click", () => openLightbox(item));
  return card;
}

function renderScroller(target, images) {
  target.innerHTML = "";
  images.forEach((item, index) => target.append(createGalleryCard(item, index, false)));
}

function renderAlbumSections(target, images) {
  target.innerHTML = "";
  const orderedAlbums = [...albumRules, { id:"album-extra", albumNo:9, rangeLabel:"Extra", name:"Additional Project References", category:"project" }];
  orderedAlbums.forEach(album => {
    const albumImages = images.filter(item => item.albumId === album.id);
    if (!albumImages.length) return;
    const section = document.createElement("section");
    section.className = "album-section";
    section.dataset.category = album.category;
    section.dataset.album = album.id;
    const heading = document.createElement("div");
    heading.className = "album-heading";
    heading.innerHTML = `<div><h2>Album ${album.albumNo}</h2><p>${album.name}</p></div><span class="album-tag">${album.rangeLabel}</span>`;
    const grid = document.createElement("div");
    grid.className = "album-grid";
    albumImages.forEach((item, index) => grid.append(createGalleryCard(item, index, true)));
    section.append(heading, grid);
    target.append(section);
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
    return;
  }
  target.querySelectorAll(".gallery-card").forEach(card => {
    card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
  });
}

function openLightbox(item) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const img = lightbox.querySelector("img");
  img.src = item.src;
  img.alt = `${item.albumName} - ${item.caption}`;
  lightbox.querySelector("[data-lightbox-title]").textContent = item.albumName;
  lightbox.querySelector("[data-lightbox-caption]").textContent = `Album ${item.albumNo} · ${item.caption}`;
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
    if (event.key === "Escape") closeLightbox();
  });
});
