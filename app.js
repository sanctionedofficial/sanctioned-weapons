// 0-100 stats. Keep it simple.
const ITEMS = [
  // Tier 1
  { name:"Glock 19", category:"Tier 1", stars:2, image:"images/glock19.png", stats:{damage:55,recoil:35,accuracy:60,range:40,fireRate:65}},
  { name:"Glock 17", category:"Tier 1", stars:2, image:"images/glock17.png", stats:{damage:52,recoil:32,accuracy:62,range:38,fireRate:66}},
  { name:"Glock 43", category:"Tier 1", stars:2, image:"images/glock43.png", stats:{damage:48,recoil:28,accuracy:58,range:32,fireRate:64}},

  // Tier 2
  { name:"Glock 45", category:"Tier 2", stars:3, image:"images/glock45.png", stats:{damage:62,recoil:42,accuracy:58,range:45,fireRate:70}},
  { name:"SIG P320", category:"Tier 2", stars:3, image:"images/p320.png", stats:{damage:64,recoil:45,accuracy:57,range:46,fireRate:68}},

  // Tier 3
  { name:"1911", category:"Tier 3", stars:4, image:"images/1911.png", stats:{damage:72,recoil:55,accuracy:52,range:50,fireRate:54}},
  { name:"FN 5.7", category:"Tier 3", stars:4, image:"images/fn57.png", stats:{damage:70,recoil:50,accuracy:60,range:56,fireRate:74}},

  // Drugs
  { name:"Weed", category:"Drugs", stars:2, image:"images/weed.png", stats:{damage:0,recoil:0,accuracy:0,range:0,fireRate:0}},
  { name:"Cocaine", category:"Drugs", stars:3, image:"images/cocaine.png", stats:{damage:0,recoil:0,accuracy:0,range:0,fireRate:0}}
];

const grid = document.getElementById("grid");
const tabs = document.querySelectorAll(".tab");
const search = document.getElementById("search");
const count = document.getElementById("count");
const randomBtn = document.getElementById("randomBtn");
const downloadJson = document.getElementById("downloadJson");

// Modal elements
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const mName = document.getElementById("mName");
const mMeta = document.getElementById("mMeta");
const mImg = document.getElementById("mImg");
const mCat = document.getElementById("mCat");
const mStars = document.getElementById("mStars");

const bDmg = document.getElementById("bDmg");
const bRec = document.getElementById("bRec");
const bAcc = document.getElementById("bAcc");
const bRng = document.getElementById("bRng");
const bFr  = document.getElementById("bFr");

const vDmg = document.getElementById("vDmg");
const vRec = document.getElementById("vRec");
const vAcc = document.getElementById("vAcc");
const vRng = document.getElementById("vRng");
const vFr  = document.getElementById("vFr");

let activeCat = "Tier 1";

function stars(n){
  return "★".repeat(n || 0) + "☆".repeat(Math.max(0, 5 - (n || 0)));
}

function matches(item){
  const q = (search.value || "").trim().toLowerCase();
  const okCat = item.category === activeCat;
  const okQ = !q || item.name.toLowerCase().includes(q);
  return okCat && okQ;
}

function card(item){
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="badge">${item.category}</div>
    <div class="thumb"><img src="${item.image}" alt="${item.name}"></div>
    <div class="meta">
      <div class="name">${item.name}</div>
      <div class="sub">
        <span>${item.category}</span>
        <span class="stars">${"★".repeat(item.stars || 0)}</span>
      </div>
    </div>
  `;
  el.addEventListener("click", () => openModal(item));
  return el;
}

function render(){
  const filtered = ITEMS.filter(matches);
  grid.innerHTML = "";
  filtered.forEach(i => grid.appendChild(card(i)));
  count.textContent = `${filtered.length} items`;
}

function setBar(barEl, valEl, value){
  const v = Math.max(0, Math.min(100, value ?? 0));
  barEl.style.width = `${v}%`;
  valEl.textContent = `${v}`;
}

function openModal(item){
  mName.textContent = item.name;
  mMeta.textContent = `${item.category} • ${item.stars || 0} Star`;
  mImg.src = item.image;

  mCat.textContent = item.category;
  mStars.textContent = stars(item.stars);

  const s = item.stats || {};
  setBar(bDmg, vDmg, s.damage);
  setBar(bRec, vRec, s.recoil);
  setBar(bAcc, vAcc, s.accuracy);
  setBar(bRng, vRng, s.range);
  setBar(bFr,  vFr,  s.fireRate);

  modal.showModal();
}

tabs.forEach(t => {
  t.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    activeCat = t.dataset.cat;
    search.value = "";
    render();
  });
});

search.addEventListener("input", render);

randomBtn.addEventListener("click", () => {
  const filtered = ITEMS.filter(matches);
  if (!filtered.length) return;
  openModal(filtered[Math.floor(Math.random() * filtered.length)]);
});

closeModal.addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// Export JSON (so you can edit data easily later)
downloadJson.addEventListener("click", (e) => {
  e.preventDefault();
  const blob = new Blob([JSON.stringify(ITEMS, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "items.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

render();
