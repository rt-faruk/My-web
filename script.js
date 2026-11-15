// Footer-er bochor
document.getElementById("year").textContent = new Date().toLocaleDateString("bn-BD", { year: "numeric" });

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Contact form
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [form.name, form.email, form.message];
  let valid = true;

  fields.forEach(f => {
    const ok = f.value.trim() !== "" && f.checkValidity();
    f.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    formMsg.textContent = "সবগুলো ঘর সঠিকভাবে পূরণ করুন।";
    formMsg.className = "form-msg error";
    return;
  }

  // Ekhane apnar email boshan. Button chaple email app khulbe.
  const to = "you@example.com";
  const subject = encodeURIComponent("ওয়েবসাইট থেকে বার্তা: " + form.name.value.trim());
  const body = encodeURIComponent(form.message.value.trim() + "\n\n" + form.name.value.trim() + "\n" + form.email.value.trim());
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

  formMsg.textContent = "ধন্যবাদ! আপনার ইমেইল অ্যাপ খুলবে।";
  formMsg.className = "form-msg ok";
  form.reset();
});
