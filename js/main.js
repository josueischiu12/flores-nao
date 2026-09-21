(() => {
  document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scroll);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Make the floating hint change its destination as the reader advances.
  const hint = document.querySelector(".scroll-hint");
  const sections = ["#recuerdos", "#video", "#carta"];
  let current = 0;

  const updateHint = () => {
    const y = window.scrollY + window.innerHeight * .55;
    const positions = sections.map(id => document.querySelector(id)?.offsetTop || Infinity);
    let next = positions.findIndex(pos => pos > y);
    if (next === -1) next = sections.length - 1;
    current = Math.min(next, sections.length - 1);
    hint.dataset.scroll = sections[current];
  };

  window.addEventListener("scroll", updateHint, { passive: true });
  updateHint();

  hint.addEventListener("click", () => {
    document.querySelector(hint.dataset.scroll)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
})();
