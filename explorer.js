// Tabs that open one panel at a time, plus the idle icon marquee.
(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  const stage = document.querySelector(".stage");
  const tabsEl = document.querySelector(".explorer .tabs");
  const tabs = [...tabsEl.querySelectorAll(".tab")];
  const indicator = tabsEl.querySelector(".indicator");
  const caption = document.querySelector(".caption");
  const capName = caption.querySelector(".cap-name");
  const capMeta = caption.querySelector(".cap-meta");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Run `change` and animate `el` from its old height to its new one.
  // Safe to call again mid-animation: it picks up from the current height.
  function withHeightTransition(change, el = stage) {
    if (reduce) return change();
    const from = el.offsetHeight;
    if (el._heightDone) el.removeEventListener("transitionend", el._heightDone);
    el.style.height = "";
    change();
    const to = el.offsetHeight;
    if (from === to) { el.style.overflow = ""; return; }
    el.style.height = `${from}px`;
    el.style.overflow = "hidden";
    el.offsetHeight; // force layout so the transition starts from `from`
    el.style.height = `${to}px`;
    el._heightDone = (e) => {
      if (e.target !== el || e.propertyName !== "height") return;
      el.style.height = "";
      el.style.overflow = "";
      el.removeEventListener("transitionend", el._heightDone);
      el._heightDone = null;
    };
    el.addEventListener("transitionend", el._heightDone);
  }

  const panels = document.querySelector(".panels");

  function open(section) {
    // Switching between sections resizes the shared box; opening or closing resizes the stage.
    const switching = section && "open" in tabsEl.dataset;
    withHeightTransition(() => {
      for (const tab of tabs) {
        const on = tab.dataset.section === section;
        tab.setAttribute("aria-expanded", String(on));
        document.getElementById(tab.getAttribute("aria-controls")).classList.toggle("open", on);
      }
      stage.classList.toggle("has-open", Boolean(section));
      if (section) {
        // Opening from closed: jump the highlight to its spot first, then fade it in.
        if (!("open" in tabsEl.dataset)) {
          indicator.style.transition = "none";
          tabsEl.dataset.active = section;
          indicator.offsetWidth;
          indicator.style.transition = "";
        }
        tabsEl.dataset.active = section;
        tabsEl.dataset.open = "";
      } else {
        // Closing: keep the position and only fade out, so it never slides across.
        delete tabsEl.dataset.open;
      }
    }, switching ? panels : stage);
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const isOpen = tab.getAttribute("aria-expanded") === "true";
      open(isOpen ? null : tab.dataset.section);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && stage.classList.contains("has-open")) open(null);
  });

  // Items inside a panel: one open at a time per list.
  function setItem(row, on) {
    row.setAttribute("aria-expanded", String(on));
    row.parentElement.classList.toggle("open", on);
    document.getElementById(row.getAttribute("aria-controls")).classList.toggle("open", on);
  }
  function toggleItem(row, on) {
    for (const other of row.closest(".list").querySelectorAll("button.row")) {
      if (other !== row && other.getAttribute("aria-expanded") === "true") setItem(other, false);
    }
    setItem(row, on);
  }
  for (const row of document.querySelectorAll(".explorer button.row")) {
    row.addEventListener("click", () => toggleItem(row, row.getAttribute("aria-expanded") !== "true"));
  }

  // Marquee chips: show a caption on hover, open the item's section on click.
  for (const chip of document.querySelectorAll(".chip")) {
    const show = () => {
      capName.textContent = chip.dataset.label;
      capMeta.textContent = chip.dataset.meta;
      caption.classList.add("show");
    };
    chip.addEventListener("pointerenter", show);
    chip.addEventListener("focus", show);
    chip.addEventListener("pointerleave", () => caption.classList.remove("show"));
    chip.addEventListener("blur", () => caption.classList.remove("show"));
    chip.addEventListener("click", () => {
      caption.classList.remove("show");
      const li = document.getElementById(`item-${chip.dataset.item}`);
      const row = li && li.querySelector("button.row");
      if (row) {
        // Expand the item instantly so the panel opens at its final height.
        const detail = document.getElementById(row.getAttribute("aria-controls"));
        detail.style.transition = "none";
        toggleItem(row, true);
        detail.offsetHeight;
        detail.style.transition = "";
      }
      open(chip.dataset.section);
      if (li) {
        li.classList.remove("flash");
        void li.offsetWidth;
        li.classList.add("flash");
      }
    });
  }

  // "How I use AI": a separate dropdown under the explorer.
  const aiTabs = document.querySelector(".ai .tabs");
  const aiTab = aiTabs.querySelector(".tab");
  const aiPanel = document.getElementById(aiTab.getAttribute("aria-controls"));
  aiTab.addEventListener("click", () => {
    const on = aiTab.getAttribute("aria-expanded") !== "true";
    withHeightTransition(() => {
      aiTab.setAttribute("aria-expanded", String(on));
      aiPanel.classList.toggle("open", on);
      if (on) aiTabs.dataset.active = "ai";
      else delete aiTabs.dataset.active;
    }, document.querySelector(".ai-stage"));
  });
})();
