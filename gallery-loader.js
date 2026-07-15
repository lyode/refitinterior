/*
  REFIT Gallery Loader V5.2
  Main gallery source: lyode/refit-media / images
  Fallback gallery source: lyode/refitinterior / assets

  This file lets your website keep the code in refitinterior,
  while project photos are loaded from refit-media/images.
*/

const REFIT_GALLERY_SOURCES = [
  {
    owner: "lyode",
    repo: "refit-media",
    branch: "main",
    path: "images",
    label: "REFIT Media"
  },
  {
    owner: "lyode",
    repo: "refitinterior",
    branch: "main",
    path: "assets",
    label: "Website Assets"
  }
];

const REFIT_FALLBACK_IMAGES = [
  "assets/project-commercial-1.jpg",
  "assets/project-commercial-2.jpg",
  "assets/project-commercial-3.jpg",
  "assets/project-residential-1.jpg",
  "assets/project-residential-2.jpg"
];

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const excludedWords = [
  "logo",
  "favicon",
  "icon",
  "wordmark",
  "android",
  "apple",
  "placeholder",
  "400.400",
  "800px",
  "incometax"
];

function isImageFile(name) {
  const lower = String(name || "").toLowerCase();
  return imageExtensions.some(ext => lower.endsWith(ext)) &&
    !excludedWords.some(word => lower.includes(word));
}

function categoryFromName(name) {
  const lower = String(name || "").toLowerCase();

  if (
    lower.includes("fnb") ||
    lower.includes("cafe") ||
    lower.includes("coffee") ||
    lower.includes("restaurant") ||
    lower.includes("food") ||
    lower.includes("rail") ||
    lower.includes("kopi")
  ) return "fnb";

  if (
    lower.includes("residential") ||
    lower.includes("home") ||
    lower.includes("house") ||
    lower.includes("condo") ||
    lower.includes("apartment") ||
    lower.includes("master") ||
    lower.includes("bedroom") ||
    lower.includes("kitchen") ||
    lower.includes("wardrobe")
  ) return "residential";

  if (
    lower.includes("maintenance") ||
    lower.includes("repair") ||
    lower.includes("defect") ||
    lower.includes("improvement") ||
    lower.includes("before") ||
    lower.includes("after") ||
    lower.includes("site")
  ) return "maintenance";

  if (
    lower.includes("concept") ||
    lower.includes("render") ||
    lower.includes("3d") ||
    lower.includes("drawing") ||
    lower.includes("cad") ||
    lower.includes("plan")
  ) return "concept";

  if (
    lower.includes("commercial") ||
    lower.includes("office") ||
    lower.includes("retail") ||
    lower.includes("shop") ||
    lower.includes("showroom")
  ) return "commercial";

  return "project";
}

function categoryLabel(category) {
  return {
    commercial: "Commercial",
    fnb: "Food & Beverage",
    residential: "Residential",
    maintenance: "Maintenance",
    concept: "Concept",
    project: "Project"
  }[category] || "Project";
}

function titleFromName(name, index) {
  return `Project Reference ${String(index + 1).padStart(2, "0")}`;
}

async function fetchGithubDirectory(source, path = source.path, depth = 0) {
  if (depth > 3) return [];

  const cleanPath = encodeURIComponent(path).replace(/%2F/g, "/");
  const apiUrl = `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${cleanPath}?ref=${source.branch}`;

  const response = await fetch(apiUrl, {
    headers: { "Accept": "application/vnd.github+json" }
  });

  if (!response.ok) {
    throw new Error(`Could not read ${source.repo}/${path}`);
  }

  const entries = await response.json();
  if (!Array.isArray(entries)) return [];

  const imageFiles = [];
  const folders = [];

  entries.forEach(entry => {
    if (entry.type === "file" && isImageFile(entry.name)) {
      imageFiles.push(entry);
    }

    if (entry.type === "dir") {
      folders.push(entry.path);
    }
  });

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
  return files.map(file => ({
    src: file.download_url,
    rawName: file.name,
    path: file.path,
    source: source.label,
    category: categoryFromName(`${file.path} ${file.name}`)
  }));
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
    return unique.map((item, index) => ({
      ...item,
      title: titleFromName(item.rawName, index),
      caption: `${categoryLabel(item.category)} reference`
    }));
  }

  return REFIT_FALLBACK_IMAGES.map((src, index) => ({
    src,
    rawName: src.split("/").pop(),
    title: titleFromName(src, index),
    category: categoryFromName(src),
    caption: `${categoryLabel(categoryFromName(src))} reference`,
    source: "Fallback"
  }));
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
  caption.innerHTML = `
    <span>${categoryLabel(item.category)}</span>
    <b>${item.title}</b>
    <small>${item.caption}</small>
  `;

  card.append(img, caption);
  card.addEventListener("click", () => openLightbox(item));
  return card;
}

function openLightbox(item) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector("img");
  img.src = item.src;
  img.alt = item.title;

  lightbox.querySelector("[data-lightbox-title]").textContent = item.title;
  lightbox.querySelector("[data-lightbox-caption]").textContent =
    `${categoryLabel(item.category)} · ${item.caption}`;

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

    target.innerHTML = "";
    images.forEach((item, index) => {
      target.append(createGalleryCard(item, index, !scroller));
    });

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
  } catch (error) {
    target.innerHTML = "<p style='color:#a8a2a0'>Project references could not load yet. Please refresh again shortly.</p>";
    console.error(error);
  }
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
