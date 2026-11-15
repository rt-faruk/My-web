// Shob data products.js (SHOP, CATEGORIES) ar db.js (DB) theke ashe.

const $ = (id) => document.getElementById(id);
let selectedCat = null;
let selectedPkg = null;

// ---- Shop er naam, link ----
document.title = SHOP.name + " | গেম টপ-আপ";
$("brandName").textContent = SHOP.name;
$("footName").textContent = SHOP.name;
$("year").textContent = new Date().toLocaleDateString("bn-BD", { year: "numeric" });
$("waLink").href = "https://wa.me/" + SHOP.whatsapp;
$("tgLink").href = SHOP.telegram;
$("telegramLink").href = SHOP.telegram;
$("loginBtn").addEventListener("click", () => alert("লগইন সুবিধা পরে যোগ হবে।"));

// ---- Category ----
function renderCategories() {
  const box = $("categories");
  CATEGORIES.forEach(cat => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat";
    b.textContent = cat.title;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => selectCategory(cat, b));
    box.appendChild(b);
  });
}

function selectCategory(cat, btn) {
  selectedCat = cat;
  selectedPkg = null;
  document.querySelectorAll(".cat").forEach(c => c.setAttribute("aria-pressed", c === btn));
  $("panelTitle").textContent = cat.title;
  $("panelNote").textContent = cat.note || "";
  $("orderForm").hidden = true;

  const box = $("packages");
  box.textContent = "";
  cat.packages.forEach(p => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pkg";
    b.setAttribute("aria-pressed", "false");
    const n = document.createElement("strong");
    n.textContent = p.name;
    const pr = document.createElement("span");
    pr.textContent = "৳" + p.price;
    b.append(n, pr);
    b.addEventListener("click", () => selectPackage(p, b));
    box.appendChild(b);
  });
  $("packagePanel").hidden = false;
}

function selectPackage(pkg, btn) {
  selectedPkg = pkg;
  document.querySelectorAll(".pkg").forEach(c => c.setAttribute("aria-pressed", c === btn));
  $("summary").textContent = `${selectedCat.title}: ${pkg.name} — ৳${pkg.price}`;
  $("formMsg").textContent = "";
  $("orderForm").hidden = false;
  $("orderForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ---- Payment ----
function renderPayments() {
  const sel = $("payMethod");
  Object.keys(SHOP.payNumbers).forEach(m => sel.add(new Option(m, m)));
  const hint = () => {
    const m = sel.value;
    $("payHint").textContent = `${m} (Send Money): ${SHOP.payNumbers[m]} নম্বরে টাকা পাঠিয়ে নিচে TrxID দিন।`;
  };
  sel.addEventListener("change", hint);
  hint();
}

// ---- Order submit ----
$("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("formMsg");
  const fields = [$("uid"), $("sender"), $("trx")];
  let ok = true;
  fields.forEach(f => {
    const good = f.value.trim() !== "";
    f.classList.toggle("invalid", !good);
    if (!good) ok = false;
  });
  if (!/^\d{6,15}$/.test($("uid").value.trim())) { $("uid").classList.add("invalid"); ok = false; }
  if (!/^01\d{9}$/.test($("sender").value.trim())) { $("sender").classList.add("invalid"); ok = false; }

  if (!selectedPkg) { msg.textContent = "আগে একটি প্যাকেজ বেছে নিন।"; msg.className = "form-msg error"; return; }
  if (!ok) { msg.textContent = "UID, নম্বর (01XXXXXXXXX) ও TrxID ঠিকভাবে দিন।"; msg.className = "form-msg error"; return; }

  try {
    const saved = await DB.saveOrder({
      category: selectedCat.title,
      package: selectedPkg.name,
      price: selectedPkg.price,
      uid: $("uid").value.trim(),
      payMethod: $("payMethod").value,
      sender: $("sender").value.trim(),
      trx: $("trx").value.trim()
    });
    msg.textContent = `অর্ডার জমা হয়েছে (${saved.id})। যাচাই শেষে ডেলিভারি দেওয়া হবে।`;
    msg.className = "form-msg ok";
    $("orderForm").reset();
    renderRecent();
  } catch (err) {
    msg.textContent = "অর্ডার জমা হয়নি। আবার চেষ্টা করুন।";
    msg.className = "form-msg error";
  }
});

// ---- Recent orders ----
async function renderRecent() {
  const list = $("recentList");
  list.textContent = "";
  const orders = await DB.getRecentOrders(8);
  if (!orders.length) {
    const li = document.createElement("li");
    li.textContent = "এখনো কোনো অর্ডার নেই।";
    list.appendChild(li);
    return;
  }
  orders.forEach(o => {
    const li = document.createElement("li");
    const left = document.createElement("span");
    // UID-r shesh 3 ghor dekhano hoy, pura UID na.
    left.textContent = `UID ****${String(o.uid).slice(-3)} · ${o.package} · ৳${o.price}`;
    const st = document.createElement("span");
    st.className = "status" + (o.status === "Done" ? " done" : "");
    st.textContent = o.status === "Done" ? "✓ সম্পন্ন" : "অপেক্ষমাণ";
    li.append(left, st);
    list.appendChild(li);
  });
}

renderCategories();
renderPayments();
renderRecent();
