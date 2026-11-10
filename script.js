(() => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade elements in as they scroll into view. The hidden state is only
  // applied once this runs, so the page never gets stuck invisible.
  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.add("in");
        io.unobserve(el);
        // Drop the stagger delay and fade transition afterwards so hover
        // effects respond immediately.
        setTimeout(() => {
          el.style.transitionDelay = "";
          el.removeAttribute("data-fade");
        }, 1200);
      }
    }, { rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll("[data-fade]").forEach((el) => {
      // Stagger siblings that share a parent so grids cascade in.
      const siblings = [...el.parentElement.querySelectorAll(":scope > [data-fade]")];
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
      io.observe(el);
    });
  }

  // Spotlight that follows the cursor across cards.
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }
})();
