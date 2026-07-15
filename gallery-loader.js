const REFIT_GALLERY = {
  owner: "lyode",
  repo: "refitinterior",
  branch: "main",
  assetPath: "assets",
  fallback: [
    "assets/project-commercial-1.jpg",
    "assets/project-commercial-2.jpg",
    "assets/project-commercial-3.jpg",
    "assets/project-residential-1.jpg",
    "assets/project-residential-2.jpg"
  ]
};

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const excludedWords = ["logo", "favicon", "icon", "wordmark", "android", "apple", "placeholder"];

function isImageFile(name) {
  const lower = name.toLowerCase();
  return imageExtensions.some(ext => lower.endsWith(ext)) &&
    !excludedWords.some(word => lower.includes(word));
}

function categoryFromName(name) {
  const lower = name.toLowerCase();
  if (lower.includes("fnb") || lower.includes("cafe") || lower.includes("coffee") || lower.includes("restaurant") || lower.includes("food")) return "fnb";
  if (lower.includes("residential") || lower.includes("home") || lower.includes("house") || lower.includes("condo") || lower.includes("apartment")) return "residential";
  if (lower.includes("maintenance") || lower.includes("repair") || lower.includes("defect") || lower.includes("improvement")) return "maintenance";
  if (lower.includes("concept") || lower.includes("render") || lower.includes("3d") || lower.includes("drawing")) return "concept";
  if (lower.includes("commercial") || lower.includes("office") || lower.includes("retail") || lower.includes("shop")) return "commercial";
  return "commercial";
}

function titleFromName(name, index) {
  const clean = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
  if (clean && !clean.match(/^Project\s?\d*$/i)) return clean;
  return `REFIT Project Reference ${index + 1}`;
}

async function fetchAssetImages() {
  const apiUrl = `https://api.github.com/repos/${REFIT_GALLERY.owner}/${REFIT_GALLERY.repo}/contents/${REFIT_GALLERY.assetPath}?ref=${REFIT_GALLERY.branch}`;
  try {
    const res = await fetch(apiUrl, { headers: { "Accept": "application/vnd.github+json" } });
    if (!res.ok) throw new Error("GitHub asset list not available");
    const files = await res.json();
    return files
      .filter(file => file.type === "file" && isImageFile(file.name))
      .map((file, index) => ({
        src: file.download_url,
        name: file.name,
        title: titleFromName(file.name, index),
        category: categoryFromName(file.name),
        caption: categoryLabel(categoryFromName(file.name)) + " project reference"
      }));
  } catch (error) {
    return REFIT_GALLERY.fallback.map((src, index) => ({
      src,
      name: src.split("/").pop(),
      title: `REFIT Project Reference ${index + 1}`,
      category: categoryFromName(src),
      caption: categoryLabel(categoryFromName(src)) + " project reference"
    }));
  }
}

function categoryLabel(category) {
  return {
    commercial: "Commercial",
    fnb: "Food & Beverage",
    residential: "Residential",
    maintenance: "Maintenance",
    concept: "Concept"
  }[category] || "Project";
}

function createGalleryCard(item, index, largeEvery = true) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  if (largeEvery && (index === 0 || index % 7 === 0)) card.classList.add("large");
  card.dataset.category = item.category;

  const img = document.createElement("img");
  img.src = item.src;
  img.alt = item.title;
  img.loading = "lazy";

  const caption = document.createElement("div");
  caption.className = "gallery-caption";
  caption.innerHTML = `<span>${categoryLabel(item.category)}</span><b>${item.title}</b><small>${item.caption}</small>`;

  card.append(img, caption);
  card.addEventListener("click", () => openLightbox(item));
  return card;
}

function openLightbox(item) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.querySelector("img").src = item.src;
  lightbox.querySelector("img").alt = item.title;
  lightbox.querySelector("[data-lightbox-title]").textContent = item.title;
  lightbox.querySelector("[data-lightbox-caption]").textContent = `${categoryLabel(item.category)} · ${item.caption}`;
  lightbox.classList.add("show");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("show");
  document.body.classList.remove("lightbox-open");
}

async function initGallery({ targetId = "projectGallery", limit = null } = {}) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const allImages = await fetchAssetImages();
  const images = limit ? allImages.slice(0, limit) : allImages;
  target.innerHTML = "";
  images.forEach((item, index) => target.append(createGalleryCard(item, index, true)));

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      target.querySelectorAll(".gallery-card").forEach(card => {
        card.style.display = filter === "all" || card.dataset.category === filter ? "" : "none";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
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
