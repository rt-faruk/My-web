// Ekjon user er nijer order er list ar status.
const $ = (id) => document.getElementById(id);
const LABEL = { Pending: "অপেক্ষমাণ", Done: "সম্পন্ন", Cancelled: "বাতিল" };

if (DB.mode !== "firebase") {
  $("notice").textContent = "Firebase সেটআপ নেই, তাই এই পাতা চলবে না।";
  $("notice").hidden = false;
} else {
  DB.onAuthChange((u) => {
    $("gate").hidden = !!u;
    $("bar").hidden = !u;
    $("logoutBtn").hidden = !u;
    if (u) load(); else $("orders").textContent = "";
  });
  $("logoutBtn").addEventListener("click", () => DB.logout());
  $("reloadBtn").addEventListener("click", load);
}

function row(label, value) {
  const d = document.createElement("div");
  d.className = "field";
  const s = document.createElement("small");
  s.textContent = label;
  const c = document.createElement("code");
  c.textContent = value;
  d.append(s, c);
  return d;
}

async function load() {
  const msg = $("listMsg");
  msg.className = "form-msg";
  msg.textContent = "লোড হচ্ছে...";
  const list = $("orders");
  try {
    const orders = await DB.getMyOrders();
    msg.textContent = "";
    list.textContent = "";
    if (!orders.length) {
      const li = document.createElement("li");
      li.className = "order";
      li.textContent = "আপনার এখনো কোনো অর্ডার নেই।";
      list.appendChild(li);
      return;
    }
    orders.forEach(o => {
      const li = document.createElement("li");
      li.className = "order";

      const top = document.createElement("div");
      top.className = "order-top";
      const t = document.createElement("strong");
      t.textContent = `${o.package} — ৳${o.price}`;
      const b = document.createElement("span");
      b.className = "badge " + o.status;
      b.textContent = LABEL[o.status] || o.status;
      top.append(t, b);

      const f = document.createElement("div");
      f.className = "fields";
      f.append(
        row("গেম", o.category),
        row("UID", o.uid),
        row("পেমেন্ট", `${o.payMethod} · ${o.trx}`),
        row("সময়", o.createdAt ? o.createdAt.toLocaleString("bn-BD") : "-"),
        row("অর্ডার আইডি", o.id.slice(0, 8).toUpperCase())
      );
      li.append(top, f);
      list.appendChild(li);
    });
  } catch (err) {
    msg.textContent = "অর্ডার লোড হয়নি। একটু পর আবার চেষ্টা করুন।";
    msg.className = "form-msg error";
  }
}
