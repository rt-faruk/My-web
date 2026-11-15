// Login / notun account / password reset. Database er kaj db.js e.
const $ = (id) => document.getElementById(id);
let signup = false;

if (DB.mode !== "firebase") {
  $("notice").textContent = "Firebase সেটআপ নেই, তাই লগইন চলবে না।";
  $("notice").hidden = false;
  $("authForm").hidden = true;
} else {
  // Age theke login kora thakle home e pathiye dey
  DB.onAuthChange((u) => { if (u) location.href = "index.html#topup"; });
}

function setMode(isSignup) {
  signup = isSignup;
  $("title").textContent = signup ? "নতুন অ্যাকাউন্ট" : "লগইন";
  $("submitBtn").textContent = signup ? "অ্যাকাউন্ট খুলুন" : "লগইন";
  $("nameRow").hidden = !signup;
  $("switchText").textContent = signup ? "আগেই অ্যাকাউন্ট আছে?" : "নতুন ইউজার?";
  $("switchBtn").textContent = signup ? "লগইন করুন" : "অ্যাকাউন্ট খুলুন";
  $("password").autocomplete = signup ? "new-password" : "current-password";
  $("resetBtn").hidden = signup;
  $("msg").textContent = "";
}
$("switchBtn").addEventListener("click", () => setMode(!signup));

function say(text, ok) {
  $("msg").textContent = text;
  $("msg").className = "form-msg " + (ok ? "ok" : "error");
}

function errText(err) {
  const c = err && err.code;
  if (c === "auth/invalid-credential" || c === "auth/wrong-password" || c === "auth/user-not-found") return "ইমেইল বা পাসওয়ার্ড ভুল।";
  if (c === "auth/email-already-in-use") return "এই ইমেইলে আগেই অ্যাকাউন্ট আছে। লগইন করুন।";
  if (c === "auth/weak-password") return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের দিন।";
  if (c === "auth/invalid-email") return "ইমেইল ঠিকভাবে লিখুন।";
  if (c === "auth/too-many-requests") return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
  return "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}

$("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim();
  const pass = $("password").value;
  if (!email || !pass) return say("ইমেইল আর পাসওয়ার্ড দিন।", false);
  $("submitBtn").disabled = true;
  try {
    if (signup) await DB.signup($("name").value.trim(), email, pass);
    else await DB.login(email, pass);
    say("সফল হয়েছে...", true);
  } catch (err) {
    say(errText(err), false);
    $("submitBtn").disabled = false;
  }
});

$("resetBtn").addEventListener("click", async () => {
  const email = $("email").value.trim();
  if (!email) return say("আগে উপরে ইমেইল লিখুন, তারপর এটা চাপুন।", false);
  try {
    await DB.resetPassword(email);
    say("পাসওয়ার্ড বদলানোর লিংক ইমেইলে পাঠানো হয়েছে (স্প্যাম ফোল্ডারও দেখুন)।", true);
  } catch (err) {
    say(errText(err), false);
  }
});
