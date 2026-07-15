const REPO_API = 'https://api.github.com/repos/lyode/refitinterior/contents/assets?ref=main';
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const EXCLUDE = /(logo|favicon|icon|wordmark|android|apple|placeholder|qr|400px|800px)/i;
const FALLBACK = [
  'project-commercial-1.jpg','project-commercial-2.jpg','project-commercial-3.jpg',
  'project-residential-1.jpg','project-residential-2.jpg','project-residential-3.jpg'
];
function cleanName(name){
  return name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).trim();
}
function categoryFor(name){
  const n=name.toLowerCase();
  if(/fnb|f&b|cafe|coffee|restaurant|food|beverage|kopi|rail/.test(n)) return 'fnb';
  if(/commercial|office|retail|shop|studio|showroom|mall/.test(n)) return 'commercial';
  if(/residential|house|home|condo|apartment|kitchen|bedroom|living|wardrobe/.test(n)) return 'residential';
  if(/maintenance|repair|defect|before|after|improvement|service/.test(n)) return 'maintenance';
  if(/concept|3d|render|drawing|cad|visual/.test(n)) return 'concept';
  return 'other';
}
function labelFor(cat){
  return {commercial:'Commercial project reference',fnb:'F&B project reference',residential:'Residential project reference',maintenance:'Maintenance / improvement reference',concept:'Concept / design reference',other:'Project reference'}[cat] || 'Project reference';
}
async function getImages(){
  try{
    const res = await fetch(REPO_API,{headers:{Accept:'application/vnd.github+json'}});
    if(!res.ok) throw new Error('Gallery list unavailable');
    const data = await res.json();
    const images = data.filter(item => item.type === 'file' && IMAGE_EXT.test(item.name) && !EXCLUDE.test(item.name))
      .map(item => ({name:item.name, src:`assets/${encodeURIComponent(item.name)}`, category:categoryFor(item.name)}));
    if(images.length) return images;
  }catch(err){ console.warn(err); }
  return FALLBACK.map(name => ({name, src:`assets/${name}`, category:categoryFor(name)}));
}
function makeTile(image, index){
  const btn=document.createElement('button');
  btn.className='project-tile';
  btn.type='button';
  btn.dataset.category=image.category;
  btn.setAttribute('aria-label', cleanName(image.name));
  btn.innerHTML = `<img loading="lazy" src="${image.src}" alt="${cleanName(image.name)}"><span class="tile-copy"><b>${cleanName(image.name) || `Project Reference ${index+1}`}</b><span>${labelFor(image.category)}</span></span>`;
  btn.addEventListener('click',()=>openLightbox(image));
  return btn;
}
function setupFilters(grid){
  const row=document.querySelector('[data-gallery-filters]');
  if(!row) return;
  row.addEventListener('click',e=>{
    const btn=e.target.closest('[data-filter]');
    if(!btn) return;
    row.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.filter;
    grid.querySelectorAll('.project-tile').forEach(tile=>{
      tile.style.display = filter === 'all' || tile.dataset.category === filter ? '' : 'none';
    });
  });
}
function ensureLightbox(){
  let box=document.querySelector('.lightbox');
  if(box) return box;
  box=document.createElement('div');
  box.className='lightbox';
  box.innerHTML=`<div class="lightbox-inner"><img alt="Project preview"><div class="lightbox-caption"><div><b></b><span></span></div><button class="lightbox-close" type="button">Close</button></div></div>`;
  document.body.appendChild(box);
  box.addEventListener('click',e=>{ if(e.target===box || e.target.closest('.lightbox-close')) box.classList.remove('open'); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') box.classList.remove('open'); });
  return box;
}
function openLightbox(image){
  const box=ensureLightbox();
  box.querySelector('img').src=image.src;
  box.querySelector('img').alt=cleanName(image.name);
  box.querySelector('b').textContent=cleanName(image.name);
  box.querySelector('span').textContent=labelFor(image.category);
  box.classList.add('open');
}
async function initGallery(){
  const grids=document.querySelectorAll('[data-gallery]');
  if(!grids.length) return;
  const images=await getImages();
  grids.forEach(grid=>{
    const limit=Number(grid.dataset.galleryLimit || images.length);
    grid.replaceChildren(...images.slice(0,limit).map(makeTile));
    setupFilters(grid);
  });
}
document.addEventListener('DOMContentLoaded', initGallery);
