// Waitlist: FormSubmit (formsubmit.co) emails each signup to the team inbox.
// After the first signup, FormSubmit sends an activation email; click it once.
// It then offers a random alias: swap it in below to hide the address.
const WAITLIST_ENDPOINT = "https://formsubmit.co/ajax/vlad.matache2008@gmail.com";

document.querySelectorAll("form.wl").forEach((form) => {
  const status = form.querySelector(".status");
  const button = form.querySelector("button");
  const say = (text, kind) => { status.textContent = text; status.className = "status " + (kind || ""); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say("Please enter a valid email address.", "err");
    if (!form.consent.checked) return say("Please tick the box so we're allowed to email you.", "err");
    if (form.botcheck.value) return location.assign("thanks.html");
    button.disabled = true; say("Adding you to the list…");
    try {
      const r = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _subject: "Katchy waitlist signup", _template: "table",
          email, university: (form.university && form.university.value.trim()) || "", consent: "yes" }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === "false") throw new Error();
      location.assign("thanks.html");
    } catch {
      say("Something went wrong on our side. Please try again in a minute.", "err");
      button.disabled = false;
    }
  });
});
