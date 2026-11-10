// Types out the intro lines one after another with a blinking caret.
// The full text stays in the HTML (and in aria-label), so it still works
// without JavaScript and screen readers read it in one go.
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lines = [...document.querySelectorAll("[data-type]")];
  if (!lines.length) return;

  const caret = document.createElement("span");
  caret.className = "caret";
  caret.setAttribute("aria-hidden", "true");

  const targets = lines.map((el) => {
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    const out = document.createElement("span");
    out.setAttribute("aria-hidden", "true");
    el.replaceChildren(out);
    el.classList.add("typing");
    return { el, out, text };
  });

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  (async () => {
    await wait(400);
    for (const [i, { el, out, text }] of targets.entries()) {
      el.append(caret);
      for (const ch of text) {
        out.textContent += ch;
        caret.classList.add("busy");
        // Heading types slower; subtitle a bit faster with slight jitter.
        await wait(i === 0 ? 85 : 30 + Math.random() * 25);
      }
      caret.classList.remove("busy");
      if (i < targets.length - 1) await wait(450);
    }
  })();
})();
