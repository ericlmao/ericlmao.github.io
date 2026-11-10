(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Registry search mock: cycles queries and highlights matches.
  const queries = [
    ["diamond", [["minecraft:diamond", "item"], ["minecraft:diamond_sword", "item"], ["minecraft:diamond_ore", "block"], ["#minecraft:diamond_ores", "tag"]]],
    ["axe", [["minecraft:netherite_axe", "item"], ["minecraft:iron_axe", "item"], ["#minecraft:mineable/axe", "tag"], ["#minecraft:axes", "tag"]]],
    ["piglin", [["minecraft:piglin", "entity"], ["minecraft:piglin_brute", "entity"], ["minecraft:piglin_head", "block"], ["#minecraft:piglin_loved", "tag"]]],
  ];
  const queryEl = document.getElementById("reg-query");
  const resultsEl = document.getElementById("reg-results");

  function renderResults(q, rows) {
    resultsEl.replaceChildren(...rows.map(([key, kind]) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      const i = key.indexOf(q);
      if (i < 0) { code.textContent = key; li.append(code); return li; }
      code.append(key.slice(0, i));
      const mark = document.createElement("mark");
      mark.textContent = q;
      code.append(mark, key.slice(i + q.length));
      const small = document.createElement("small");
      small.textContent = kind;
      li.append(code, small);
      return li;
    }));
  }
  renderResults(queries[0][0], queries[0][1]);

  if (!reduce && queryEl) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      let n = 0;
      for (;;) {
        await wait(2600);
        n = (n + 1) % queries.length;
        const [q, rows] = queries[n];
        while (queryEl.textContent.length) {
          queryEl.textContent = queryEl.textContent.slice(0, -1);
          await wait(45);
        }
        for (const ch of q) {
          queryEl.textContent += ch;
          await wait(85);
        }
        renderResults(q, rows);
      }
    })();
  }

  if (reduce || !window.gsap) return;
  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  // Hero entrance, then console lines print one by one.
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("[data-hero]", { y: 24, opacity: 0, duration: 0.7, stagger: 0.09 })
    .from("#console-log li", { opacity: 0, duration: 0.01, stagger: 0.28 }, "-=0.2");

  // Section reveals.
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 32, opacity: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  // Server bars grow when the chart scrolls in.
  gsap.from(".bar span", {
    scaleX: 0, duration: 0.9, ease: "power2.out", stagger: 0.12,
    scrollTrigger: { trigger: ".chart", start: "top 75%", once: true },
  });
  gsap.from(".bar em", {
    opacity: 0, duration: 0.3, stagger: 0.12, delay: 0.6,
    scrollTrigger: { trigger: ".chart", start: "top 75%", once: true },
  });

  // RealView graph draws in.
  const line = document.querySelector(".studio-graph .line");
  if (line) {
    const len = line.getTotalLength();
    gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut",
      scrollTrigger: { trigger: ".t-realview", start: "top 75%", once: true },
    });
  }
})();
